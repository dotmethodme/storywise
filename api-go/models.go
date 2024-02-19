package main

import (
	"database/sql"
	"time"
)

type CountByKeyValue struct {
	Key   sql.NullString
	Value sql.NullString
	Count int
}

type SessionItem struct {
	Year  int
	Month int
	Day   int
	Count int
}

type CountHitsPerPage struct {
	Path  string
	Count int
}

type CountByReferrer struct {
	Referrer string
	Count    int
}

type CountByCountry struct {
	Country string
	Count   int
}

type Stats struct {
	UniqueVisitors  int
	TotalPageviews  int
	ViewsPerVisitor float64
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
