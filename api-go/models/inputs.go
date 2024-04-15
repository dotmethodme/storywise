package models

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
