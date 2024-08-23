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

	huma.Register(api, huma.Operation{
		OperationID: "ImportData",
		Method:      http.MethodPost,
		Path:        "/admin/api/data-io/import",
		Summary:     "Example to upload a file",
	}, func(ctx context.Context, input *models.ImportDataInput) (*struct{}, error) {
		file := input.RawBody.File
		if file == nil {
			return nil, fiber.NewError(fiber.StatusBadRequest, "Missing file")
		}

		fileName := file["filename"]
		if fileName == nil {
			return nil, fiber.NewError(fiber.StatusBadRequest, "Missing filename")
		}

		firstPart := fileName[0]
		if firstPart == nil {
			return nil, fiber.NewError(fiber.StatusBadRequest, "Missing first part")
		}

		// validate file type (csv)
		if firstPart.Header.Get("Content-Type") != "text/csv" {
			return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid file type")
		}

		openedFile, err := firstPart.Open()
		if openedFile == nil {
			return nil, fiber.NewError(fiber.StatusBadRequest, "Missing opened file")
		}
		defer openedFile.Close()
		if err != nil {
			return nil, err
		}

		// parse file into database
		err = pg.ImportDataFromFile(openedFile)
		if err != nil {
			return nil, err
		}

		return &struct{}{}, nil
	})

	app.Get("/admin/api/data-io/download-file", func(c *fiber.Ctx) error {
		filePath := c.Query("file_path")
		if filePath == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Missing file_path"})
		}

		if !isValidPath(filePath) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid file_path"})
		}

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
