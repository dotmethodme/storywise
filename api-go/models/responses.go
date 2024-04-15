package models

type GetCountSessionsByUserAgentResponse struct {
	Body struct {
		Items []CountByKeyValue `json:"items"`
	}
}
type GetSessionsPerDayResponse struct {
	Body struct {
		Items []SessionItem `json:"items"`
	}
}

type GetTopReferrersResponse struct {
	Body struct {
		Items []CountByReferrer `json:"items"`
	}
}

type GetHitsPerPageResponse struct {
	Body struct {
		Items []CountHitsPerPage `json:"items"`
	}
}

type GetUniqueSessionsPerPageResponse struct {
	Body struct {
		Items []CountHitsPerPage `json:"items"`
	}
}

type GetUniqueSessionsByCountryResponse struct {
	Body struct {
		Items []CountByCountry `json:"items"`
	}
}

type GetStatsResponse struct {
	Body struct {
		Item Stats `json:"item"`
	}
}

type GetAppsResponse struct {
	Body struct {
		Items []App `json:"items"`
	}
}

type GetHasEventsResponse struct {
	Body struct {
		HasEvents bool `json:"hasEvents"`
	}
}

type GetCountSessionsByUtmResponse struct {
	Body struct {
		Items []CountByKeyValue `json:"items"`
	}
}

type GetConfigResponse struct {
	Body struct {
		Config Config `json:"config"`
	}
}

type GetDataIoResponse struct {
	Body struct {
		Items []DataIo `json:"items"`
	}
}

type MessageResponse struct {
	Message string `json:"message"`
}
