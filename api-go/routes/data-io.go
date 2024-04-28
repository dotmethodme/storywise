package routes

import (
	"context"
	"net/http"
	"os"

	"github.com/danielgtaylor/huma/v2"
	"github.com/gofiber/fiber/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
)

func RegisterDataIoRoutes(api huma.API, pg *db.PostgresRepo, app *fiber.App) {
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

		response := &models.MessageResponse{}
		response.Body.Message = "Success"
		return response, nil
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

		response := &models.MessageResponse{}
		response.Body.Message = "Success"
		return response, nil
	})

	app.Get("/admin/api/data-io/download-file", func(c *fiber.Ctx) error {
		// Extract the file_path query parameter
		filePath := c.Query("file_path")
		if filePath == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Missing file_path"})
		}

		// Optional: Perform security checks on filePath here to prevent directory traversal attacks
		if !isValidPath(filePath) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid file_path"})
		}

		// Serve the file
		return c.SendFile("./" + filePath)
	})
}

func isValidPath(filePath string) bool {
	res, err := os.Stat(filePath)
	if err != nil {
		return false
	}

	// Check if the file is a regular file
	if res.Mode().IsRegular() {
		return true
	}

	return false
}
