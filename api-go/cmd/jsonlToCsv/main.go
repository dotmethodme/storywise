package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"joinstorywise.com/api/utils"
)

type WebEventRead struct {
	ID                  int        `json:"id" db:"id"`
	AppID               *string    `json:"app_id" db:"app_id"`
	SessionID           *string    `json:"session_id" db:"session_id"`
	Path                *string    `json:"path" db:"path"`
	Timestamp           *time.Time `json:"timestamp" db:"timestamp"`
	IP                  *string    `json:"ip" db:"ip"`
	UserAgent           *string    `json:"user_agent" db:"user_agent"`
	Referrer            *string    `json:"referrer" db:"referrer"`
	Language            *string    `json:"language" db:"language"`
	Country             *string    `json:"country" db:"country"`
	ScreenWidth         *int       `json:"screen_width" db:"screen_width"`
	ScreenHeight        *int       `json:"screen_height" db:"screen_height"`
	WindowWidth         *int       `json:"window_width" db:"window_width"`
	WindowHeight        *int       `json:"window_height" db:"window_height"`
	BotName             *string    `json:"bot_name" db:"bot_name"`
	BotCategory         *string    `json:"bot_category" db:"bot_category"`
	BotURL              *string    `json:"bot_url" db:"bot_url"`
	BotProducerName     *string    `json:"bot_producer_name" db:"bot_producer_name"`
	BotProducerURL      *string    `json:"bot_producer_url" db:"bot_producer_url"`
	ClientType          *string    `json:"client_type" db:"client_type"`
	ClientName          *string    `json:"client_name" db:"client_name"`
	ClientVersion       *string    `json:"client_version" db:"client_version"`
	ClientEngine        *string    `json:"client_engine" db:"client_engine"`
	ClientEngineVersion *string    `json:"client_engine_version" db:"client_engine_version"`
	DeviceType          *string    `json:"device_type" db:"device_type"`
	DeviceBrand         *string    `json:"device_brand" db:"device_brand"`
	DeviceModel         *string    `json:"device_model" db:"device_model"`
	OSName              *string    `json:"os_name" db:"os_name"`
	OSVersion           *string    `json:"os_version" db:"os_version"`
	OSPlatform          *string    `json:"os_platform" db:"os_platform"`
	UtmSource           *string    `json:"utm_source" db:"utm_source"`
	UtmMedium           *string    `json:"utm_medium" db:"utm_medium"`
	UtmCampaign         *string    `json:"utm_campaign" db:"utm_campaign"`
	UtmTerm             *string    `json:"utm_term" db:"utm_term"`
	UtmContent          *string    `json:"utm_content" db:"utm_content"`
}

func pointerToString(ptr *string) string {
	if ptr == nil {
		return ""
	}
	return *ptr
}

func intPointerToString(ptr *int) string {
	if ptr == nil {
		return ""
	}
	return fmt.Sprintf("%d", *ptr)
}

func main() {
	// Open the JSONL file
	jsonlFile, err := os.Open("./input.jsonl")
	if err != nil {
		log.Fatalf("Failed to open JSONL file: %v", err)
	}
	defer jsonlFile.Close()

	// Create a CSV file
	csvFile, err := os.Create("output.csv")
	if err != nil {
		log.Fatalf("Failed to create CSV file: %v", err)
	}
	defer csvFile.Close()

	writer := csv.NewWriter(csvFile)
	defer writer.Flush()

	scanner := bufio.NewScanner(jsonlFile)

	// Track headers to ensure they're only written once
	headersWritten := false

	lineNumber := 0
	for scanner.Scan() {
		lineNumber++
		line := scanner.Text()

		var row WebEventRead
		if err := json.Unmarshal([]byte(line), &row); err != nil {
			log.Fatalf("Failed to unmarshal JSON line %d: %v", lineNumber, err)
		}

		// Extract headers from the first JSON object
		if !headersWritten {

			if err := writer.Write(utils.CsvHeaders); err != nil {
				log.Fatalf("Failed to write headers to CSV file: %v", err)
			}
			headersWritten = true
		}

		// Convert the row to a slice of strings
		record := []string{
			fmt.Sprintf("%d", row.ID),
			pointerToString(row.AppID),
			pointerToString(row.SessionID),
			pointerToString(row.Path),
			row.Timestamp.Format(time.RFC3339),
			pointerToString(row.IP),
			pointerToString(row.UserAgent),
			pointerToString(row.Referrer),
			pointerToString(row.Language),
			pointerToString(row.Country),
			intPointerToString(row.ScreenWidth),
			intPointerToString(row.ScreenHeight),
			intPointerToString(row.WindowWidth),
			intPointerToString(row.WindowHeight),
			pointerToString(row.BotName),
			pointerToString(row.BotCategory),
			pointerToString(row.BotURL),
			pointerToString(row.BotProducerName),
			pointerToString(row.BotProducerURL),
			pointerToString(row.ClientType),
			pointerToString(row.ClientName),
			pointerToString(row.ClientVersion),
			pointerToString(row.ClientEngine),
			pointerToString(row.ClientEngineVersion),
			pointerToString(row.DeviceType),
			pointerToString(row.DeviceBrand),
			pointerToString(row.DeviceModel),
			pointerToString(row.OSName),
			pointerToString(row.OSVersion),
			pointerToString(row.OSPlatform),
			pointerToString(row.UtmSource),
			pointerToString(row.UtmMedium),
			pointerToString(row.UtmCampaign),
			pointerToString(row.UtmTerm),
			pointerToString(row.UtmContent),
		}

		if err := writer.Write(record); err != nil {
			log.Fatalf("Failed to write record to CSV file: %v", err)
		}
	}

	if err := scanner.Err(); err != nil {
		log.Fatalf("Error reading JSONL file: %v", err)
	}
}
