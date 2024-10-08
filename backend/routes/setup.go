package routes

import (
	"log"
	"os"
	"strings"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humafiber"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/middlewares"
)

func CreateApp(pg *db.PostgresRepo) *fiber.App {

	app := fiber.New()
	api := humafiber.New(app, huma.DefaultConfig("Storywise API", "1.0.0"))

	// Middlewares
	if os.Getenv("ALLOWED_ORIGINS") == "" {
		app.Use(cors.New())
	} else {
		app.Use(cors.New(cors.Config{
			AllowOrigins: os.Getenv("ALLOWED_ORIGINS"),
			AllowHeaders: "Origin, Content-Type, Accept",
		}))
	}
	app.Use(logger.New(logger.Config{
		Format: `{"time":"${time}","status":${status},"latency":"${latency}","ip":"${ip}","method":"${method}","path":"${path}","error":"${error}"}` + "\n",
	}))
	app.Use("/admin/*", middlewares.AuthMiddleware)
	app.Use("/admin/jwt/:token", middlewares.JwtAuthMiddleware)

	// Routes
	RegisterStatsRoutes(api, pg)
	RegisterAppsRoutes(api, pg)
	RegisterDataIoRoutes(api, pg, app)
	RegisterConfigRoutes(api, pg)
	RegisterEventRoutes(api, pg)

	// Serve frontend
	if os.Getenv("ENV") == "local" {
		app.Get("/admin", proxy.Forward("http://localhost:5173/admin"))
		app.Get("/admin/*", func(c *fiber.Ctx) error {
			path := c.Path()
			query := c.Request().URI().QueryString()
			queryString := string(query)

			return proxy.Forward("http://localhost:5173" + path + "?" + queryString)(c)
		})
	} else {
		app.Static("/admin", "dist-frontend")
	}

	scriptFile := loadScriptFile()

	app.Get("/js/script.js", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")

		fileContent := strings.ReplaceAll(scriptFile, "{{API_BASE_URL}}", os.Getenv("API_BASE_URL"))
		fileContent = strings.ReplaceAll(fileContent, "{{APP_ID}}", app_id)

		// set the content type to javascript

		c.Set(fiber.HeaderContentType, "application/javascript")

		return c.SendString(fileContent)
	})

	app.Use("/", func(ctx *fiber.Ctx) error {
		// redirect to admin page
		return ctx.Redirect("/admin/")
	})

	return app
}

func loadScriptFile() string {
	var stringFileCache, err = os.ReadFile("templates/script.js")
	if err != nil {
		log.Fatal("Error reading script.js file")
	}

	return string(stringFileCache)
}
