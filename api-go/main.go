package main

import (
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()
	pg := NewPostgresRepo()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

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

		return c.JSON(HasAnyEvents{
			HasEvents: result,
		})
	})

	log.Fatal(app.Listen(":3000"))
}
