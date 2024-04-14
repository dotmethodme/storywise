package main

import (
	"context"
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

	huma.Register(api, huma.Operation{
		OperationID: "GetCountSessionsByUserAgent",
		Path:        "/admin/api/count_sessions_by_user_agent",
		Method:      http.MethodGet,
		Summary:     "Get count of sessions by user agent",
	}, func(ctx context.Context, input *models.GenericInputWithKey) (*models.GetCountSessionsByUserAgentResponse, error) {
		response := &models.GetCountSessionsByUserAgentResponse{}

		result, err := pg.GetSessionCountByUserAgent(input.AppId, input.Key, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetSessionsPerDay",
		Path:        "/admin/api/sessions_per_day",
		Method:      http.MethodGet,
		Summary:     "Get sessions per day",
	}, func(ctx context.Context, input *models.GenericInput) (*models.GetSessionsPerDayResponse, error) {
		response := &models.GetSessionsPerDayResponse{}

		result, err := pg.GetSessionsPerDay(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetTopReferrers",
		Path:        "/admin/api/top_referrers",
		Method:      http.MethodGet,
		Summary:     "Get top referrers",
	}, func(ctx context.Context, input *models.GenericInput) (*models.GetTopReferrersResponse, error) {
		response := &models.GetTopReferrersResponse{}

		result, err := pg.GetTopReferrers(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetHitsPerPage",
		Path:        "/admin/api/hits_per_page",
		Method:      http.MethodGet,
		Summary:     "Get hits per page",
	}, func(ctx context.Context, input *models.GenericInput) (*models.GetHitsPerPageResponse, error) {
		response := &models.GetHitsPerPageResponse{}

		result, err := pg.GetHitsPerPage(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetUniqueSessionsPerPage",
		Path:        "/admin/api/unique_sessions_per_page",
		Method:      http.MethodGet,
		Summary:     "Get unique sessions per page",
	}, func(ctx context.Context, input *models.GenericInput) (*models.GetUniqueSessionsPerPageResponse, error) {
		response := &models.GetUniqueSessionsPerPageResponse{}

		result, err := pg.GetUniqueSessionsPerPage(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetUniqueSessionsByCountry",
		Path:        "/admin/api/unique_sessions_by_country",
		Method:      http.MethodGet,
		Summary:     "Get unique sessions by country",
	}, func(ctx context.Context, input *models.GenericInput) (*models.GetUniqueSessionsByCountryResponse, error) {
		response := &models.GetUniqueSessionsByCountryResponse{}

		result, err := pg.GetUniqueSessionsByCountry(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetStats",
		Path:        "/admin/api/stats",
		Method:      http.MethodGet,
		Summary:     "Get stats",
	}, func(ctx context.Context, input *models.GenericInput) (*models.GetStatsResponse, error) {
		response := &models.GetStatsResponse{}

		result, err := pg.GetStats(input.AppId, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Item = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetApps",
		Path:        "/admin/api/apps",
		Method:      http.MethodGet,
		Summary:     "Get apps",
	}, func(ctx context.Context, input *struct{}) (*models.GetAppsResponse, error) {
		response := &models.GetAppsResponse{}

		result, err := pg.ListApps()
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetHasEvents",
		Path:        "/admin/api/has-events",
		Method:      http.MethodGet,
		Summary:     "Get has events",
	}, func(ctx context.Context, input *struct {
		AppId string `query:"app_id" default:"default" doc:"App ID"`
	}) (*models.GetHasEventsResponse, error) {
		response := &models.GetHasEventsResponse{}

		result, err := pg.HasAnyEvents(input.AppId)
		if err != nil {
			return nil, err
		}

		response.Body.HasEvents = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetCountSessionsByUtm",
		Path:        "/admin/api/count_sessions_by_utm",
		Method:      http.MethodGet,
		Summary:     "Get count of sessions by utm",
	}, func(ctx context.Context, input *models.GenericInputWithKey) (*models.GetCountSessionsByUtmResponse, error) {
		response := &models.GetCountSessionsByUtmResponse{}

		result, err := pg.GetSessionCountByUtmTag(input.AppId, input.Key, input.Days)
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetConfig",
		Path:        "/admin/api/config",
		Method:      http.MethodGet,
		Summary:     "Get config",
	}, func(ctx context.Context, input *struct{}) (*models.GetConfigResponse, error) {
		config := &models.GetConfigResponse{}
		hasEvents, err := pg.HasAnyEvents("")
		if err != nil {
			return nil, err
		}

		config.Body.Config = models.Config{
			HasEvents:     hasEvents,
			AllowedOrigin: os.Getenv("ALLOWED_ORIGIN"),
			ApiBaseUrl:    os.Getenv("API_BASE_URL"),
		}

		if config.Body.Config.AllowedOrigin == "" {
			config.Body.Config.AllowedOrigin = "*"
		}

		if config.Body.Config.ApiBaseUrl == "" {
			config.Body.Config.ApiBaseUrl = "http://localhost:" + port
		}

		return config, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "GetDataIo",
		Path:        "/admin/api/data-io",
		Method:      http.MethodGet,
		Summary:     "Get data io",
	}, func(ctx context.Context, input *struct{}) (*models.GetDataIoResponse, error) {
		response := &models.GetDataIoResponse{}

		result, err := pg.ListDataIo()
		if err != nil {
			return nil, err
		}

		response.Body.Items = result
		return response, nil
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
