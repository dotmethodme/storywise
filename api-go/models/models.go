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
	AppID          *string
	SessionID      *string
	Path           *string
	Timestamp      time.Time
	IP             *string
	UserAgent      *string
	Referrer       *string
	Language       *string
	Country        *string
	ScreenWidth    *int
	ScreenHeight   *int
	WindowWidth    *int
	WindowHeight   *int
	DeviceDetector *devicedetector.DeviceInfo
	UtmSource      *string
	UtmMedium      *string
	UtmCampaign    *string
	UtmTerm        *string
	UtmContent     *string
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
	ID        *string `json:"id"`
	Type      *string `json:"type"`
	Status    *string `json:"status"`
	FilePath  *string `json:"file_path"`
	CreatedAt *string `json:"created_at"`
	UpdatedAt *string `json:"updated_at"`
	Data      *string `json:"data"`
}
