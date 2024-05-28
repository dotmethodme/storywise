package scripts

import (
	"log"
	"math/rand"
	"time"

	devicedetector "github.com/gamebtc/devicedetector"
	"github.com/lib/pq"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
)

func SeedDemo(daysCount int) {

	log.Println("Seeding demo data")
	repo := db.NewPostgresRepo()
	users := generateUsers(200)

	// Insert events into the database
	repo.Db.Exec("TRUNCATE TABLE events")

	for i := 0; i < daysCount; i++ {
		var events []models.WebEvent
		numberOfUsers := rand.Intn(len(users))
		usersForDate := pickRandomUsers(users, numberOfUsers)

		for _, user := range usersForDate {
			numberOfEvents := rand.Intn(10) + 1

			for j := 0; j < numberOfEvents; j++ {
				utmSource := getRandomElement(utmSources)
				utmMedium := getRandomElement(utmMediums)
				utmCampaign := getRandomElement(utmCampaigns)
				referrer := getRandomElement(referrers)
				path := getRandomElement(paths)

				event := models.WebEvent{
					AppID:          "default",
					SessionID:      user.SessionID,
					Country:        user.Country,
					UserAgent:      user.UserAgent,
					Language:       user.Language,
					ScreenWidth:    user.ScreenWidth,
					ScreenHeight:   user.ScreenHeight,
					Timestamp:      getDaysAgoRandomTime(i),
					Path:           path,
					Referrer:       referrer,
					UtmSource:      utmSource,
					UtmMedium:      utmMedium,
					UtmCampaign:    utmCampaign,
					WindowWidth:    user.ScreenWidth,
					WindowHeight:   user.ScreenHeight,
					DeviceDetector: *user.DeviceDetector,
				}
				events = append(events, event)
			}
		}

		writeEvents(repo, events)
	}

	log.Println("Seeding demo data complete")

}

func writeEvents(repo *db.PostgresRepo, events []models.WebEvent) {
	txn, err := repo.Db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	stmt, err := txn.Prepare(
		pq.CopyIn("events",
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
		))

	if err != nil {
		log.Fatal(err)
	}

	for _, event := range events {

		bot := event.DeviceDetector.GetBot()
		client := event.DeviceDetector.GetClient()
		device := event.DeviceDetector.GetDevice()
		os := event.DeviceDetector.GetOs()

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

		_, err := stmt.Exec(
			event.SessionID,
			event.Path,
			event.Timestamp,
			nil,
			event.UserAgent,
			event.Referrer,
			event.Language,
			event.Country,
			event.ScreenWidth,
			event.ScreenHeight,
			event.WindowWidth,
			event.WindowHeight,
			bot_name,
			bot_category,
			bot_url,
			bot_producer_name,
			bot_producer_url,
			client_type,
			client_name,
			client_version,
			client_engine,
			client_engine_version,
			device_type,
			device_brand,
			device_model,
			os_name,
			os_version,
			os_platform,
		)

		if err != nil {
			log.Fatal(err)
		}
	}

	_, err = stmt.Exec()
	if err != nil {
		log.Fatal(err)
	}

	err = stmt.Close()
	if err != nil {
		log.Fatal(err)
	}

	err = txn.Commit()
	if err != nil {
		log.Fatal(err)
	}

}

type User struct {
	Country        string
	UserAgent      string
	SessionID      string
	Language       string
	ScreenWidth    int
	ScreenHeight   int
	DeviceDetector *devicedetector.DeviceInfo
}

type ScreenSize struct {
	Width, Height int
}

// Static data arrays
var (
	countries    = []string{"DK", "SE", "UK", "US", "DE", "FR", "ES", "IT", "NL", "NO", "FI", "PL", "RU", "CN", "JP", "IN", "BR", "CA", "AU", "NZ", "MX", "AR", "ZA", "EG", "NG", "KE", "ET", "TZ", "UG", "GH", "CI", "CM", "SN", "ZW", "RW", "MZ", "AO", "NA", "ZM", "MW", "MG", "MU", "SC", "SZ", "LS", "BW", "LY", "TN", "MA", "DZ", "SA", "AE", "QA", "OM", "KW", "BH", "YE", "IQ", "SY", "JO", "LB", "IL", "TR", "IR", "PK", "AF", "BD", "LK", "NP", "MM", "TH", "VN", "MY", "ID", "PH", "KH", "LA", "KR", "TW", "HK", "MO", "SG"}
	languages    = []string{"en-GB,en;q=0.7", "en-US,en;q=0.5", "en-CA,en;q=0.3", "en-IE,en;q=0.1", "da-DK,da;q=0.9", "da;q=0.7", "da-DK;q=0.5", "da-DK;q=0.3", "de-DE,de;q=0.9", "de;q=0.7", "de-DE;q=0.5", "es-ES,es;q=0.9", "es;q=0.7", "es-ES;q=0.5", "fr-FR,fr;q=0.9", "fr;q=0.7"}
	userAgents   = []string{"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.124 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.196 Mobile Safari/537.36"}
	referrers    = []string{"https://www.google.com/", "https://twitter.com/", "https://www.facebook.com/", "https://www.youtube.com/", "https://www.instagram.com/", "https://www.linkedin.com/", ""}
	paths        = []string{"/", "/about/", "/contact/", "/mission/", "/posts/", "/posts/why-i-love-python/", "/posts/why-i-love-javascript/", "/posts/why-i-love-rust/", "/posts/why-i-love-go/", "/posts/why-i-love-c/", "/posts/why-i-love-c++/", "/posts/why-i-love-c#/", "/posts/why-i-do-not-love-java/", "/posts/why-i-love-php/", "/posts/why-i-love-ruby/", "/posts/why-i-love-swift/", "/posts/why-i-love-kotlin/", "/posts/why-i-love-scala/", "/where-i-work/", "/where-i-work/awesome-company/", "/where-i-work/awesome-company/awesome-team/", "/where-i-work/awesome-company/awesome-team/awesome-person/", "/what-i-do/", "/what-i-do/awesome-thing/", "/what-i-do/awesome-thing/awesome-sub-thing/"}
	screenSizes  = []ScreenSize{{1920, 1080}, {1440, 900}, {1536, 864}, {1366, 768}, {1280, 800}, {1024, 768}, {800, 600}, {640, 480}}
	utmSources   = []string{"google", "facebook", "twitter"}
	utmMediums   = []string{"cpc", "social", "email"}
	utmCampaigns = []string{"awesome-campaign", "awesome-campaign-2", "awesome-campaign-3"}
)

// Random generator functions
func init() {
	rand.Seed(time.Now().UnixNano())
}

func getRandomElement[T any](slice []T) T {
	return slice[rand.Intn(len(slice))]
}

func generateRandomSessionID() string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, 13)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

var dd, _ = devicedetector.NewDeviceDetector("regexes")

func getDetectorResult(userAgent string) *devicedetector.DeviceInfo {
	info := dd.Parse(userAgent)
	return info
}

func generateUsers(numberOfVirtualUsers int) []User {
	users := make([]User, numberOfVirtualUsers)
	for i := range users {
		screen := getRandomElement(screenSizes)
		ua := getRandomElement(userAgents)
		uaInfo := getDetectorResult(ua)
		users[i] = User{
			Country:        getRandomElement(countries),
			UserAgent:      ua,
			SessionID:      generateRandomSessionID(),
			Language:       getRandomElement(languages),
			ScreenWidth:    screen.Width,
			ScreenHeight:   screen.Height,
			DeviceDetector: uaInfo,
		}
	}
	return users
}

func getDaysAgoRandomTime(daysAgo int) time.Time {
	now := time.Now()

	// Subtract n days from the current time
	daysAgoTime := now.AddDate(0, 0, -daysAgo)

	// Generate random time values
	hours := rand.Intn(24)
	minutes := rand.Intn(60)
	seconds := rand.Intn(60)
	nanoseconds := rand.Intn(1e9) // 1e9 nanoseconds in a second

	// Replace the hour, minute, second, and nanosecond parts of daysAgoTime with random values
	randomTime := time.Date(daysAgoTime.Year(), daysAgoTime.Month(), daysAgoTime.Day(),
		hours, minutes, seconds, nanoseconds, daysAgoTime.Location())

	return randomTime
}

func pickRandomUsers(users []User, x int) []User {
	shuffled := make([]User, len(users))
	copy(shuffled, users)
	rand.Shuffle(len(shuffled), func(i, j int) { shuffled[i], shuffled[j] = shuffled[j], shuffled[i] })

	if x > len(shuffled) {
		x = len(shuffled) // If x is larger than the slice, limit it to the length of the slice
	}
	return shuffled[:x]
}
