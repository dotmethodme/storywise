package routes

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
)

func RegisterDataIoRoutes(api huma.API, pg *db.PostgresRepo) {
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

	huma.Register(api, huma.Operation{
		OperationID: "DeleteDataIo",
		Path:        "/admin/api/data-io/{id}",
		Method:      http.MethodDelete,
		Summary:     "Delete data io",
	}, func(ctx context.Context, input *struct {
		ID string `path:"id" doc:"Data IO ID"`
	}) (*models.MessageResponse, error) {
		err := pg.DeleteDataIo(input.ID)
		if err != nil {
			return nil, err
		}

		return &models.MessageResponse{Message: "Success"}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "StartExport",
		Path:        "/admin/api/data-io/start-export",
		Method:      http.MethodPost,
		Summary:     "Start export",
	}, func(ctx context.Context, input *struct{}) (*models.MessageResponse, error) {
		err := pg.StartExport()
		if err != nil {
			return nil, err
		}

		return &models.MessageResponse{Message: "Success"}, nil
	})
}
