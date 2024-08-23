package routes

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
	"joinstorywise.com/api/utils"
)

func RegisterEventRoutes(api huma.API, pg *db.PostgresRepo) {
	huma.Register(api, huma.Operation{
		OperationID: "CreateEvent",
		Path:        "/api/event",
		Method:      http.MethodPost,
	}, func(ctx context.Context, input *models.CreateEventInput) (*struct{}, error) {
		response := struct{}{}

		event := utils.ExtractEvent(input)

		db.InsertEvent(pg, event)

		return &response, nil

	})

	huma.Register(api, huma.Operation{
		OperationID: "EchoEvent",
		Path:        "/api/event/echo",
		Method:      http.MethodPost,
	}, func(ctx context.Context, input *models.CreateEventInput) (*models.EventResponse, error) {
		response := &models.EventResponse{}
		event := utils.ExtractEvent(input)

		response.Body.Event = event

		return response, nil

	})

}
