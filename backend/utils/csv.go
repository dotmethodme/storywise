package utils

import (
	"fmt"
	"strconv"
	"time"

	"joinstorywise.com/api/models"
)

var CsvHeaders = []string{
	"id",
	"app_id",
	"session_id",
	"path",
	"timestamp",
	"ip",
	"user_agent",
	"referrer",
	"language",
	"country",
	"screen_width",
	"screen_height",
	"window_width",
	"window_height",
	"bot_name",
	"bot_category",
	"bot_url",
	"bot_producer_name",
	"bot_producer_url",
	"client_type",
	"client_name",
	"client_version",
	"client_engine",
	"client_engine_version",
	"device_type",
	"device_brand",
	"device_model",
	"os_name",
	"os_version",
	"os_platform",
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
}

func ParseRecordToWebEvent(headers []string, record []string) (models.WebEventWrite, error) {
	var event models.WebEventWrite
	for i, header := range headers {
		switch header {
		case "app_id":
			event.AppID = record[i]
		case "session_id":
			event.SessionID = record[i]
		case "path":
			event.Path = record[i]
		case "timestamp":
			timestamp, err := time.Parse(time.RFC3339, record[i])
			if err != nil {
				return event, fmt.Errorf("invalid timestamp: %v", err)
			}
			event.Timestamp = timestamp
		case "ip":
			event.IP = record[i]
		case "user_agent":
			event.UserAgent = record[i]
		case "referrer":
			event.Referrer = record[i]
		case "language":
			event.Language = record[i]
		case "country":
			event.Country = record[i]
		case "screen_width":
			screenWidth, err := strconv.Atoi(record[i])
			if err != nil {
				return event, fmt.Errorf("invalid screen_width: %v", err)
			}
			event.ScreenWidth = screenWidth
		case "screen_height":
			screenHeight, err := strconv.Atoi(record[i])
			if err != nil {
				return event, fmt.Errorf("invalid screen_height: %v", err)
			}
			event.ScreenHeight = screenHeight
		case "window_width":
			windowWidth, err := strconv.Atoi(record[i])
			if err != nil {
				return event, fmt.Errorf("invalid window_width: %v", err)
			}
			event.WindowWidth = windowWidth
		case "window_height":
			windowHeight, err := strconv.Atoi(record[i])
			if err != nil {
				return event, fmt.Errorf("invalid window_height: %v", err)
			}
			event.WindowHeight = windowHeight
		case "bot_name":
			event.BotName = record[i]
		case "bot_category":
			event.BotCategory = record[i]
		case "bot_url":
			event.BotURL = record[i]
		case "bot_producer_name":
			event.BotProducerName = record[i]
		case "bot_producer_url":
			event.BotProducerURL = record[i]
		case "client_type":
			event.ClientType = record[i]
		case "client_name":
			event.ClientName = record[i]
		case "client_version":
			event.ClientVersion = record[i]
		case "client_engine":
			event.ClientEngine = record[i]
		case "client_engine_version":
			event.ClientEngineVersion = record[i]
		case "device_type":
			event.DeviceType = record[i]
		case "device_brand":
			event.DeviceBrand = record[i]
		case "device_model":
			event.DeviceModel = record[i]
		case "os_name":
			event.OSName = record[i]
		case "os_version":
			event.OSVersion = record[i]
		case "os_platform":
			event.OSPlatform = record[i]
		case "utm_source":
			event.UtmSource = record[i]
		case "utm_medium":
			event.UtmMedium = record[i]
		case "utm_campaign":
			event.UtmCampaign = record[i]
		case "utm_term":
			event.UtmTerm = record[i]
		case "utm_content":
			event.UtmContent = record[i]
		}
	}
	return event, nil
}
