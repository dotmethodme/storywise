package main

import (
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"joinstorywise.com/api/db"
	"joinstorywise.com/api/middlewares"
	"joinstorywise.com/api/migrations"
	"joinstorywise.com/api/models"
)

func main() {
	port := os.Getenv("PORT")
	app := fiber.New()
	pg := db.NewPostgresRepo()

	migrations.ExecuteAll(pg)

	app.Use(logger.New(logger.Config{
		Format: `{"time":"${time}","status":${status},"latency":"${latency}","ip":"${ip}","method":"${method}","path":"${path}","error":"${error}"}` + "\n",
	}))
	app.Use("/admin/*", middlewares.AuthMiddleware)
	app.Use("/admin/jwt/:token", middlewares.JwtAuthMiddleware)
	app.Static("/admin", "dist-frontend")

	app.Get("/admin/api/count_sessions_by_user_agent", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		key := c.Query("key", "user_agent")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetSessionCountByUserAgent(app_id, key, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/sessions_per_day", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetSessionsPerDay(app_id, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/top_referrers", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetTopReferrers(app_id, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/hits_per_page", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetHitsPerPage(app_id, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get((`/admin/api/unique_sessions_per_page`), func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetUniqueSessionsPerPage(app_id, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/unique_sessions_by_country", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetUniqueSessionsByCountry(app_id, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/stats", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetStats(app_id, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/apps", func(c *fiber.Ctx) error {
		result, err := pg.ListApps()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	app.Get("/admin/api/has-events", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		result, err := pg.HasAnyEvents(app_id)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(models.HasAnyEvents{
			HasEvents: result,
		})
	})

	app.Get("/admin/api/config", func(c *fiber.Ctx) error {
		hasEvents, err := pg.HasAnyEvents("")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"hasEvents":     hasEvents,
			"allowedOrigin": "http://localhost:" + port,
			"apiBaseUrl":    "http://localhost:" + port,
		})
	})

	app.Get("/admin/api/count_sessions_by_utm", func(c *fiber.Ctx) error {
		app_id := c.Query("app_id", "default")
		key := c.Query("key", "utm_source")
		days := c.Query("days", "30")
		daysInt, err := strconv.Atoi(days)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "days must be a number",
			})
		}

		result, err := pg.GetSessionCountByUtmTag(app_id, key, daysInt)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.JSON(result)
	})

	log.Fatal(app.Listen(":" + port))
}
