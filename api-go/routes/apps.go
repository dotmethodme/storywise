package routes

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
)

func RegisterAppsRoutes(api huma.API, pg *db.PostgresRepo) {
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
		OperationID: "CreateApp",
		Path:        "/admin/api/apps",
		Method:      http.MethodPost,
		Summary:     "Create app",
	}, func(ctx context.Context, input *models.CreateAppInput) (*models.MessageResponse, error) {
		err := pg.CreateApp(input.Body.Name)
		if err != nil {
			return nil, err
		}

		return &models.MessageResponse{Message: "Success"}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "UpdateApp",
		Path:        "/admin/api/apps/{id}",
		Method:      http.MethodPut,
		Summary:     "Update app",
	}, func(ctx context.Context, input *models.UpdateAppInput) (*models.MessageResponse, error) {
		err := pg.UpdateApp(input.ID, input.Body.Name)
		if err != nil {
			return nil, err
		}

		return &models.MessageResponse{Message: "Success"}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "DeleteApp",
		Path:        "/admin/api/apps/{id}",
		Method:      http.MethodDelete,
		Summary:     "Delete app",
	}, func(ctx context.Context, input *struct {
		ID string `path:"id" doc:"App ID"`
	}) (*models.MessageResponse, error) {
		err := pg.DeleteApp(input.ID)
		if err != nil {
			return nil, err
		}

		return &models.MessageResponse{Message: "Success"}, nil
	})

}
