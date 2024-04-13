package models

type GenericInput struct {
	AppId string `query:"app_id" default:"default" doc:"App ID"`
	Days  int    `query:"days" default:"30" doc:"Days"`
}
