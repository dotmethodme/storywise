package models

import (
	"database/sql"
	"encoding/json"
	"time"
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
	Key   NullableString `json:"key"`
	Value NullableString `json:"value"`
	Count NullableString `json:"count"`
}

type CountHitsPerPage struct {
	Path  NullableString `json:"path"`
	Count NullableString `json:"count"`
}

type CountByReferrer struct {
	Referrer NullableString `json:"referrer"`
	Count    NullableString `json:"count"`
}

type CountByCountry struct {
	Country NullableString `json:"country"`
	Count   NullableString `json:"count"`
}

type Stats struct {
	UniqueVisitors  string  `json:"uniqueVisitors"`
	TotalPageviews  string  `json:"totalPageviews"`
	ViewsPerVisitor float32 `json:"viewsPerVisitor"`
}

type WebEvent struct {
	AppID        string
	SessionID    string
	Path         string
	Timestamp    time.Time
	IP           *string // Optional fields are pointers
	UserAgent    *string
	Referrer     *string
	Language     *string
	Country      *string
	ScreenWidth  *int
	ScreenHeight *int
	WindowWidth  *int
	WindowHeight *int
	EventClientDetails
	UtmTags
}

type EventClientDetails struct {
	BotName             *string
	BotCategory         *string
	BotURL              *string
	BotProducerName     *string
	BotProducerURL      *string
	ClientType          *string
	ClientName          *string
	ClientVersion       *string
	ClientEngine        *string
	ClientEngineVersion *string
	DeviceType          *string // Adjusted from GenericDeviceResult["type"] to string for simplicity
	DeviceBrand         *string
	DeviceModel         *string
	OSName              *string
	OSVersion           *string
	OSPlatform          *string // Adjusted from OperatingSystemResult["platform"] to string
}

type UtmTags struct {
	UtmSource   *string
	UtmMedium   *string
	UtmCampaign *string
	UtmTerm     *string
	UtmContent  *string
}

type SessionItem struct {
	Year  string `json:"year"`
	Month string `json:"month"`
	Day   string `json:"day"`
	Count string `json:"count"`
}

type App struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	URLs      string `json:"urls"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type HasAnyEvents struct {
	HasEvents bool `json:"hasEvents"`
}
