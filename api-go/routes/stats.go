package routes

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
)

func RegisterStatsRoutes(api huma.API, pg *db.PostgresRepo) {
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
}
