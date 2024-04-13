package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

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
	}, func(ctx context.Context, input *models.GenericInput) (*GetSessionsPerDayOutput, error) {
		response := &GetSessionsPerDayOutput{}

		result, err := pg.GetSessionsPerDay(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	type GetTopReferrersOutput struct {
		Body struct {
			Items []models.CountByReferrer `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetTopReferrers",
		Path:        "/admin/api/top_referrers",
		Method:      http.MethodGet,
		Summary:     "Get top referrers",
	}, func(ctx context.Context, input *models.GenericInput) (*GetTopReferrersOutput, error) {
		response := &GetTopReferrersOutput{}

		result, err := pg.GetTopReferrers(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	type GetHitsPerPageOutput struct {
		Body struct {
			Items []models.CountHitsPerPage `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetHitsPerPage",
		Path:        "/admin/api/hits_per_page",
		Method:      http.MethodGet,
		Summary:     "Get hits per page",
	}, func(ctx context.Context, input *models.GenericInput) (*GetHitsPerPageOutput, error) {
		response := &GetHitsPerPageOutput{}

		result, err := pg.GetHitsPerPage(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	type GetUniqueSessionsPerPageOutput struct {
		Body struct {
			Items []models.CountHitsPerPage `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetUniqueSessionsPerPage",
		Path:        "/admin/api/unique_sessions_per_page",
		Method:      http.MethodGet,
		Summary:     "Get unique sessions per page",
	}, func(ctx context.Context, input *models.GenericInput) (*GetUniqueSessionsPerPageOutput, error) {
		response := &GetUniqueSessionsPerPageOutput{}

		result, err := pg.GetUniqueSessionsPerPage(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	type GetUniqueSessionsByCountryOutput struct {
		Body struct {
			Items []models.CountByCountry `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetUniqueSessionsByCountry",
		Path:        "/admin/api/unique_sessions_by_country",
		Method:      http.MethodGet,
		Summary:     "Get unique sessions by country",
	}, func(ctx context.Context, input *models.GenericInput) (*GetUniqueSessionsByCountryOutput, error) {
		response := &GetUniqueSessionsByCountryOutput{}

		result, err := pg.GetUniqueSessionsByCountry(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	type GetStatsOutput struct {
		Body struct {
			Item models.Stats `json:"item"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetStats",
		Path:        "/admin/api/stats",
		Method:      http.MethodGet,
		Summary:     "Get stats",
	}, func(ctx context.Context, input *models.GenericInput) (*GetStatsOutput, error) {
		response := &GetStatsOutput{}

		result, err := pg.GetStats(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Item = result
		return response, nil
	})

	type GetAppsOutput struct {
		Body struct {
			Items []models.App `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetApps",
		Path:        "/admin/api/apps",
		Method:      http.MethodGet,
		Summary:     "Get apps",
	}, func(ctx context.Context, input *struct{}) (*GetAppsOutput, error) {
		response := &GetAppsOutput{}

		result, err := pg.ListApps()
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	type GetHasEventsOutput struct {
		Body struct {
			HasEvents bool `json:"hasEvents"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetHasEvents",
		Path:        "/admin/api/has-events",
		Method:      http.MethodGet,
		Summary:     "Get has events",
	}, func(ctx context.Context, input *struct {
		AppId string `query:"app_id" default:"default" doc:"App ID"`
	}) (*GetHasEventsOutput, error) {
		response := &GetHasEventsOutput{}

		result, err := pg.HasAnyEvents(input.AppId)
		if err != nil {
			return nil, err
		}

		response.Body.HasEvents = result
		return response, nil
	})

	type GetCountSessionsByUtmOutput struct {
		Body struct {
			Items []models.CountByKeyValue `json:"items"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "GetCountSessionsByUtm",
		Path:        "/admin/api/count_sessions_by_utm",
		Method:      http.MethodGet,
		Summary:     "Get count of sessions by utm",
	}, func(ctx context.Context, input *struct {
		AppId string `query:"app_id" default:"default" doc:"App ID"`
		Key   string `query:"key" default:"utm_source" doc:"Key"`
		Days  int    `query:"days" default:"30" doc:"Days"`
	}) (*GetCountSessionsByUtmOutput, error) {
		response := &GetCountSessionsByUtmOutput{}

		result, err := pg.GetSessionCountByUtmTag(input.AppId, input.Key, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
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

	log.Fatal(app.Listen(":" + port))
}
