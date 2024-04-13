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
