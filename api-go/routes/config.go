package routes

import (
	"context"
	"net/http"
	"os"

	"github.com/danielgtaylor/huma/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
)

func RegisterConfigRoutes(api huma.API, pg *db.PostgresRepo) {
	port := os.Getenv("PORT")

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

	// health check

	huma.Register(api, huma.Operation{
		OperationID: "HealthCheck",
		Path:        "/api/health",
		Method:      http.MethodGet,
		Summary:     "Health check",
	}, func(ctx context.Context, input *struct{}) (*models.MessageResponse, error) {
		response := &models.MessageResponse{}
		response.Body.Message = "Success"
		return response, nil
	})

}
