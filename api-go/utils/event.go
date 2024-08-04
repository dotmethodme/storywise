package utils

import (
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"time"

	devicedetector "github.com/gamebtc/devicedetector"
	"joinstorywise.com/api/models"
)

var dd, _ = devicedetector.NewDeviceDetector("regexes")

func ExtractEvent(input *models.CreateEventInput) models.WebEventWrite {

	bot_name := ""
	bot_category := ""
	bot_url := ""
	bot_producer_name := ""
	bot_producer_url := ""
	client_type := ""
	client_name := ""
	client_version := ""
	client_engine := ""
	client_engine_version := ""
	device_type := ""
	device_brand := ""
	device_model := ""
	os_name := ""
	os_version := ""
	os_platform := ""

	deviceDetector := dd.Parse(input.UserAgent)
	if deviceDetector != nil {
		bot := deviceDetector.GetBot()
		client := deviceDetector.GetClient()
		device := deviceDetector.GetDevice()
		os := deviceDetector.GetOs()

		if bot != nil {
			bot_name = bot.Name
			bot_category = bot.Category
			bot_url = bot.Url
			bot_producer_name = bot.Producer.Name
			bot_producer_url = bot.Producer.Url
		}

		if client != nil {
			client_type = client.Type
			client_name = client.Name
			client_version = client.Version
			client_engine = client.Engine
			client_engine_version = client.EngineVersion
		}

		if device != nil {
			device_type = device.Type
			device_brand = device.Brand
			device_model = device.Model
		}

		if os != nil {
			os_name = os.Name
			os_version = os.Version
			os_platform = os.Platform
		}
	}

	event := models.WebEventWrite{
		AppID:        input.Body.AppId,
		SessionID:    extractSessionId(input),
		Timestamp:    time.Now(), // now
		Path:         input.Body.Path,
		Referrer:     input.Body.Referrer,
		ScreenWidth:  input.Body.ScreenWidth,
		ScreenHeight: input.Body.ScreenHeight,
		WindowWidth:  input.Body.WindowWidth,
		WindowHeight: input.Body.WindowHeight,
		UserAgent:    input.UserAgent,
		Language:     input.AcceptLanguage,
		Country:      input.CfIpCountry,

		// Utm
		UtmSource:   input.Body.UtmSource,
		UtmMedium:   input.Body.UtmMedium,
		UtmCampaign: input.Body.UtmCampaign,
		UtmTerm:     input.Body.UtmTerm,
		UtmContent:  input.Body.UtmContent,

		// Device
		BotName:             bot_name,
		BotCategory:         bot_category,
		BotURL:              bot_url,
		BotProducerName:     bot_producer_name,
		BotProducerURL:      bot_producer_url,
		ClientType:          client_type,
		ClientName:          client_name,
		ClientVersion:       client_version,
		ClientEngine:        client_engine,
		ClientEngineVersion: client_engine_version,
		DeviceType:          device_type,
		DeviceBrand:         device_brand,
		DeviceModel:         device_model,
		OSName:              os_name,
		OSVersion:           os_version,
		OSPlatform:          os_platform,
	}

	return event
}

func extractSessionId(input *models.CreateEventInput) string {
	ip := getIpFromRequest(input)
	data := fmt.Sprintf("%s%s", ip, input.UserAgent)
	hash := sha1.New()
	hash.Write([]byte(data))
	return base64.StdEncoding.EncodeToString(hash.Sum(nil))
}

func getIpFromRequest(req *models.CreateEventInput) string {
	ip := req.CfConnectingIp
	if ip != "" {
		return ip
	}

	ip = req.XRealIp
	if ip != "" {
		return ip
	}

	ip = req.XForwardedFor
	if ip != "" {
		return ip
	}

	return ""
}
