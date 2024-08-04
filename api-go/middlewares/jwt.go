package middlewares

import (
	"errors"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
	jwt "github.com/golang-jwt/jwt"
)

// Authenticates requests using JWT.
func JwtAuthMiddleware(c *fiber.Ctx) error {
	publicKeyString := os.Getenv("JWT_PUBLIC_KEY")
	appName := os.Getenv("DATABASE_NAME")

	if publicKeyString == "" || appName == "" {
		return c.Status(http.StatusUnauthorized).SendString("Backend does not support JWTs")
	}

	tokenString := c.Params("token")
	if tokenString == "" {
		return c.Status(http.StatusUnauthorized).SendString("JWT Authentication required")
	}

	publicKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKeyString))
	if err != nil {
		// Handle error on parsing public key
		return c.Status(http.StatusInternalServerError).SendString("Error parsing public key")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return publicKey, nil
	})

	if err != nil || !token.Valid {
		return c.Status(http.StatusUnauthorized).SendString("JWT Authentication failed")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["appName"] != appName {
		return c.Status(http.StatusUnauthorized).SendString("JWT Authentication failed")
	}

	// Set a cookie with the JWT for further requests
	c.Cookie(&fiber.Cookie{
		Name:     "storywise_token",
		Value:    tokenString,
		HTTPOnly: true,
	})

	// Redirect to the admin panel
	return c.Redirect("/admin")
}

// CustomClaims extends the standard jwt claims with the appName.
type CustomClaims struct {
	AppName string `json:"appName"`
	jwt.StandardClaims
}

func VerifyJwt(tokenString string) (*CustomClaims, error) {
	publicKeyString := os.Getenv("JWT_PUBLIC_KEY")
	appName := os.Getenv("DATABASE_NAME")

	if publicKeyString == "" || appName == "" {
		return nil, errors.New("backend does not support JWTs")
	}

	publicKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(publicKeyString))
	if err != nil {
		return nil, err // Could not parse public key
	}

	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return publicKey, nil
	})

	if err != nil {
		return nil, err // Token parsing or validation failed
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		if claims.AppName != appName {
			return nil, errors.New("invalid JWT: appName does not match")
		}
		return claims, nil
	}

	return nil, errors.New("invalid JWT")
}
