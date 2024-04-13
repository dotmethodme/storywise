package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humafiber"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/proxy"

	"github.com/joho/godotenv"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/middlewares"
	"joinstorywise.com/api/migrations"
	"joinstorywise.com/api/models"
)

type GreetingOutput struct {
	Body struct {
		Message string `json:"message" example:"Hello, world!" doc:"Greeting message"`
	}
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	pg := db.NewPostgresRepo()
	migrations.ExecuteAll(pg)

	app := fiber.New()

	api := humafiber.New(app, huma.DefaultConfig("Storywise API", "1.0.0"))

	app.Use(logger.New(logger.Config{
		Format: `{"time":"${time}","status":${status},"latency":"${latency}","ip":"${ip}","method":"${method}","path":"${path}","error":"${error}"}` + "\n",
	}))
	app.Use("/admin/*", middlewares.AuthMiddleware)
	app.Use("/admin/jwt/:token", middlewares.JwtAuthMiddleware)

	// Register GET /greeting/{name} handler.
	huma.Get(api, "/greeting/{name}", func(ctx context.Context, input *struct {
		Name string `path:"name" maxLength:"30" example:"world" doc:"Name to greet"`
	}) (*GreetingOutput, error) {
		resp := &GreetingOutput{}
		resp.Body.Message = fmt.Sprintf("Hello, %s!", input.Name)
		return resp, nil
	})

	// app.Get("/admin/api/count_sessions_by_user_agent", func(c *fiber.Ctx) error {
	// 	app_id := c.Query("app_id", "default")
	// 	key := c.Query("key", "user_agent")
	// 	days := c.Query("days", "30")
	// 	daysInt, err := strconv.Atoi(days)
	// 	if err != nil {
	// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 			"error": "days must be a number",
	// 		})
	// 	}

	// 	result, err := pg.GetSessionCountByUserAgent(app_id, key, daysInt)
	// 	if err != nil {
	// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 			"error": err.Error(),
	// 		})
	// 	}

	// 	return c.JSON(result)
	// })

	type GetCountSessionsByUserAgentOutput struct {
		Body struct {
			Items []models.CountByKeyValue `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetCountSessionsByUserAgent",
		Path:        "/admin/api/count_sessions_by_user_agent",
		Method:      http.MethodGet,
		Summary:     "Get count of sessions by user agent",
	}, func(ctx context.Context, input *struct {
		AppId string `query:"app_id" default:"default" doc:"App ID"`
		Key   string `query:"key" default:"user_agent" doc:"Key"`
		Days  int    `query:"days" default:"30" doc:"Days"`
	}) (*GetCountSessionsByUserAgentOutput, error) {
		response := &GetCountSessionsByUserAgentOutput{}

		result, err := pg.GetSessionCountByUserAgent(input.AppId, input.Key, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result

		return response, nil
	})

	// app.Get("/admin/api/sessions_per_day", func(c *fiber.Ctx) error {
	// 	app_id := c.Query("app_id", "default")
	// 	days := c.Query("days", "30")
	// 	daysInt, err := strconv.Atoi(days)
	// 	if err != nil {
	// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
	// 			"error": "days must be a number",
	// 		})
	// 	}

	// 	result, err := pg.GetSessionsPerDay(app_id, daysInt)
	// 	if err != nil {
	// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 			"error": err.Error(),
	// 		})
	// 	}

	// 	return c.JSON(result)
	// })

	type GetSessionsPerDayOutput struct {
		Body struct {
			Items []models.SessionItem `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetSessionsPerDay",
		Path:        "/admin/api/sessions_per_day",
		Method:      http.MethodGet,
		Summary:     "Get sessions per day",
	}, func(ctx context.Context, input *struct {
		AppId string `query:"app_id" default:"default" doc:"App ID"`
		Days  int    `query:"days" default:"30" doc:"Days"`
	}) (*GetSessionsPerDayOutput, error) {
		response := &GetSessionsPerDayOutput{}

		result, err := pg.GetSessionsPerDay(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result

		return response, nil
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

	if os.Getenv("ENV") == "local" {
		app.Get("/admin", proxy.Forward("http://localhost:5173/admin"))
		app.Get("/admin/*", func(c *fiber.Ctx) error {
			log.Println(c.Path())
			return proxy.Forward("http://localhost:5173" + c.Path())(c)
		})
	} else {
		app.Static("/admin", "dist-frontend")
	}

	log.Fatal(app.Listen(":" + port))
}
