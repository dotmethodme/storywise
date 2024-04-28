package routes

import (
	"os"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humafiber"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/middlewares"
)

func CreateApp(pg *db.PostgresRepo) *fiber.App {

	app := fiber.New()
	api := humafiber.New(app, huma.DefaultConfig("Storywise API", "1.0.0"))

	// Middleware
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

	return app
}
