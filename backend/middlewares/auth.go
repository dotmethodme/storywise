package middlewares

import (
	"encoding/base64"
	"net/http"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// AuthMiddleware authenticates requests using Basic Auth or JWT.
func AuthMiddleware(c *fiber.Ctx) error {
	// Skip authentication in totally insecure mode.
	if os.Getenv("TOTALLY_INSECURE_MODE_WITH_NO_PASSWORD") == "true" {
		return c.Next()
	}

	// JWT token present in cookies.
	if storywiseToken := c.Cookies("storywise_token"); storywiseToken != "" {
		_, err := VerifyJwt(storywiseToken)
		if err == nil {
			return c.Next()
		}
		c.ClearCookie("storywise_token")
		return c.Status(http.StatusUnauthorized).SendString("JWT Authentication failed")
	}

	expectedUser := os.Getenv("STORYWISE_USERNAME")
	expectedPass := os.Getenv("STORYWISE_PASSWORD")
	expectedPassHash := os.Getenv("STORYWISE_PASSWORD_HASH")

	authorization := c.Get("Authorization")
	if authorization == "" {
		c.Set("WWW-Authenticate", `Basic realm="401"`)
		return c.Status(http.StatusUnauthorized).SendString("Authentication required.")
	}

	incomingUser, incomingPass := extractCredentialsFromBasicAuthHeader(authorization)

	if expectedPassHash != "" {
		// Verify password against hashed password.
		err := bcrypt.CompareHashAndPassword([]byte(expectedPassHash), []byte(incomingPass))
		if err == nil && incomingUser == expectedUser {
			return c.Next()
		}
	} else if expectedPass != "" {
		// Direct password comparison.
		if incomingUser == expectedUser && incomingPass == expectedPass {
			return c.Next()
		}
	}

	c.Set("WWW-Authenticate", `Basic realm="401"`)
	return c.Status(http.StatusUnauthorized).SendString("Authentication required.")
}

// extractCredentialsFromBasicAuthHeader decodes the Basic Auth header to extract credentials.
func extractCredentialsFromBasicAuthHeader(authorization string) (string, string) {
	base64Credentials := strings.SplitN(authorization, " ", 2)[1]
	credentials, _ := base64.StdEncoding.DecodeString(base64Credentials)
	parts := strings.SplitN(string(credentials), ":", 2)
	if len(parts) != 2 {
		return "", "" // Return empty credentials if parsing fails.
	}
	return parts[0], parts[1]
}
