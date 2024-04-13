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
	AppID          string
	SessionID      string
	Path           string
	Timestamp      time.Time
	IP             string // Optional fields are pointers
	UserAgent      string
	Referrer       string
	Language       string
	Country        string
	ScreenWidth    int
	ScreenHeight   int
	WindowWidth    int
	WindowHeight   int
	DeviceDetector *devicedetector.DeviceInfo
	UtmSource      string
	UtmMedium      string
	UtmCampaign    string
	UtmTerm        string
	UtmContent     string
}

type SessionItem struct {
	Year  string `json:"year"`
	Month string `json:"month"`
	Day   string `json:"day"`
	Count string `json:"count"`
}

type App struct {
	ID        *string `json:"id"`
	Name      *string `json:"name"`
	URLs      *string `json:"urls"`
	CreatedAt *string `json:"created_at"`
	UpdatedAt *string `json:"updated_at"`
}

type HasAnyEvents struct {
	HasEvents bool `json:"hasEvents"`
}
