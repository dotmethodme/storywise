package models

import "mime/multipart"

type GenericInput struct {
	AppId string `query:"app_id" default:"default" doc:"App ID"`
	Days  int    `query:"days" default:"30" doc:"Days"`
}

type GenericInputWithKey struct {
	AppId string `query:"app_id" default:"default" doc:"App ID"`
	Key   string `query:"key" default:"user_agent" doc:"Key"`
	Days  int    `query:"days" default:"30" doc:"Days"`
}

type UpdateAppInput struct {
	ID   string `path:"id" doc:"App ID"`
	Body struct {
		Name string `json:"name" doc:"App name"`
	}
}

type CreateAppInput struct {
	Body struct {
		Name string `json:"name" doc:"App name"`
	}
}

type CreateEventInput struct {
	Body struct {
		_            struct{} `json:"-" additionalProperties:"true"`
		AppId        string   `json:"app_id" required:"true"`
		Path         string   `json:"path" required:"true"`
		Referrer     string   `json:"referrer" required:"false"`
		ScreenWidth  int      `json:"screen_width" required:"false"`
		ScreenHeight int      `json:"screen_height" required:"false"`
		WindowWidth  int      `json:"window_width" required:"false"`
		WindowHeight int      `json:"window_height" required:"false"`
		UtmSource    string   `json:"utm_source" required:"false"`
		UtmMedium    string   `json:"utm_medium" required:"false"`
		UtmCampaign  string   `json:"utm_campaign" required:"false"`
		UtmTerm      string   `json:"utm_term" required:"false"`
		UtmContent   string   `json:"utm_content" required:"false"`
		EventType    string   `json:"event_type" required:"false"`
	}
	UserAgent      string `header:"user-agent"`
	AcceptLanguage string `header:"accept-language"`
	CfIpCountry    string `header:"cf-ipcountry"`
	CfConnectingIp string `header:"cf-connecting-ip"`
	XRealIp        string `header:"x-real-ip"`
	XForwardedFor  string `header:"x-forwarded-for"`
}

type ImportDataInput struct {
	RawBody multipart.Form
}
