package models

import (
	"database/sql"
	"encoding/json"
	"time"

	devicedetector "github.com/gamebtc/devicedetector"
)

type NullableString struct {
	sql.NullString
}

func (s NullableString) MarshalJSON() ([]byte, error) {
	if s.Valid {
		return json.Marshal(s.String)
	}
	return []byte(`null`), nil
}

type CountByKeyValue struct {
	Key   *string `json:"key"`
	Value *string `json:"value"`
	Count *string `json:"count"`
}

type CountHitsPerPage struct {
	Path  *string `json:"path"`
	Count *string `json:"count"`
}

type CountByReferrer struct {
	Referrer *string `json:"referrer"`
	Count    *string `json:"count"`
}

type CountByCountry struct {
	Country *string `json:"country"`
	Count   *string `json:"count"`
}

type Stats struct {
	UniqueVisitors  *string `json:"uniqueVisitors"`
	TotalPageviews  *string `json:"totalPageviews"`
	ViewsPerVisitor *string `json:"viewsPerVisitor"`
}

type WebEvent struct {
	ID                  int                       `json:"id" db:"id"`
	AppID               string                    `json:"appId" db:"app_id"`
	SessionID           string                    `json:"sessionId" db:"session_id"`
	Path                string                    `json:"path" db:"path"`
	Timestamp           time.Time                 `json:"timestamp" db:"timestamp"`
	IP                  string                    `json:"ip" db:"ip"`
	UserAgent           string                    `json:"userAgent" db:"user_agent"`
	Referrer            string                    `json:"referrer" db:"referrer"`
	Language            string                    `json:"language" db:"language"`
	Country             string                    `json:"country" db:"country"`
	ScreenWidth         int                       `json:"screenWidth" db:"screen_width"`
	ScreenHeight        int                       `json:"screenHeight" db:"screen_height"`
	WindowWidth         int                       `json:"windowWidth" db:"window_width"`
	WindowHeight        int                       `json:"windowHeight" db:"window_height"`
	BotName             string                    `json:"botName" db:"bot_name"`
	BotCategory         string                    `json:"botCategory" db:"bot_category"`
	BotURL              string                    `json:"botURL" db:"bot_url"`
	BotProducerName     string                    `json:"botProducerName" db:"bot_producer_name"`
	BotProducerURL      string                    `json:"botProducerURL" db:"bot_producer_url"`
	ClientType          string                    `json:"clientType" db:"client_type"`
	ClientName          string                    `json:"clientName" db:"client_name"`
	ClientVersion       string                    `json:"clientVersion" db:"client_version"`
	ClientEngine        string                    `json:"clientEngine" db:"client_engine"`
	ClientEngineVersion string                    `json:"clientEngineVersion" db:"client_engine_version"`
	DeviceType          string                    `json:"deviceType" db:"device_type"`
	DeviceBrand         string                    `json:"deviceBrand" db:"device_brand"`
	DeviceModel         string                    `json:"deviceModel" db:"device_model"`
	OSName              string                    `json:"osName" db:"os_name"`
	OSVersion           string                    `json:"osVersion" db:"os_version"`
	OSPlatform          string                    `json:"osPlatform" db:"os_platform"`
	UtmSource           string                    `json:"utmSource" db:"utm_source"`
	UtmMedium           string                    `json:"utmMedium" db:"utm_medium"`
	UtmCampaign         string                    `json:"utmCampaign" db:"utm_campaign"`
	UtmTerm             string                    `json:"utmTerm" db:"utm_term"`
	UtmContent          string                    `json:"utmContent" db:"utm_content"`
	DeviceDetector      devicedetector.DeviceInfo `json:"deviceDetector" db:"device_detector"`
}

type SessionItem struct {
	Year  string `json:"year"`
	Month string `json:"month"`
	Day   string `json:"day"`
	Count string `json:"count"`
}

type App struct {
	ID        *string `json:"id" db:"id" path:"id"`
	Name      *string `json:"name" db:"name"`
	URLs      *string `json:"urls" db:"urls"`
	CreatedAt *string `json:"created_at" db:"created_at"`
	UpdatedAt *string `json:"updated_at" db:"updated_at"`
}

type HasAnyEvents struct {
	HasEvents bool `json:"hasEvents"`
}

type Config struct {
	HasEvents     bool   `json:"hasEvents"`
	AllowedOrigin string `json:"allowedOrigin"`
	ApiBaseUrl    string `json:"apiBaseUrl"`
}

type DataIo struct {
	ID        *string `json:"id" db:"id" path:"id"`
	Type      *string `json:"type" db:"type"`
	Status    *string `json:"status" db:"status"`
	FilePath  *string `json:"file_path" db:"file_path"`
	CreatedAt *string `json:"created_at" db:"created_at"`
	UpdatedAt *string `json:"updated_at" db:"updated_at"`
	Data      *string `json:"data" db:"data"`
}
