package db

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	uuid "github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"joinstorywise.com/api/models"
	"joinstorywise.com/api/utils"
)

type PostgresRepo struct {
	Db *sqlx.DB
}

func IsTimescaleEnabled() bool {
	return os.Getenv("TIMESCALE_ENABLED") == "true"
}

func NewPostgresRepo() *PostgresRepo {
	dbUrl := os.Getenv("POSTGRES_URL")
	if dbUrl == "" {
		log.Fatal("POSTGRES_URL is not set")
	}

	if strings.HasPrefix(dbUrl, "postgresql://") {
		db, err := sqlx.Connect("postgres", dbUrl)
		if err != nil {
			log.Fatalf("Failed to open database: %v", err)
		}
		return &PostgresRepo{Db: db}
	}

	dbUser := utils.GetEnvWithDefault("POSTGRES_USER", "")
	dbPassword := utils.GetEnvWithDefault("POSTGRES_PASSWORD", "")
	dbName := utils.GetEnvWithDefault("POSTGRES_DB", "")
	dbHost := utils.GetEnvWithDefault("POSTGRES_HOST", "localhost")
	dbPort := utils.GetEnvWithDefault("POSTGRES_PORT", "5432")
	dbOptions := utils.GetEnvWithDefault("POSTGRES_OPTIONS", "sslmode=disable")

	dbUrl = fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%s %s",
		dbUser,
		dbPassword,
		dbName,
		dbHost,
		dbPort,
		dbOptions,
	)

	db, err := sqlx.Connect("postgres", dbUrl)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	return &PostgresRepo{Db: db}
}

func getDaysAgo(days int) time.Time {
	now := time.Now()
	daysAgo := now.AddDate(0, 0, -days)
	daysAgo = time.Date(daysAgo.Year(), daysAgo.Month(), daysAgo.Day(), 0, 0, 0, 0, time.UTC)
	return daysAgo
}

var allowedKeysUserAgent = map[string]string{
	"client_type":  "client_type",
	"client_name":  "client_name",
	"device_type":  "device_type",
	"device_brand": "device_brand",
	"os_name":      "os_name",
}

func (repo *PostgresRepo) GetSessionCountByUserAgent(appId string, key string, numberOfDays int) ([]models.CountByKeyValue, error) {
	column, ok := allowedKeysUserAgent[key]
	if !ok {
		log.Printf("Invalid key provided: %s", key)
		return nil, fmt.Errorf("invalid key provided")
	}

	query := fmt.Sprintf(`
        SELECT '%s' AS key, %s as value, COUNT(DISTINCT session_id) AS count
        FROM events
        WHERE timestamp >= $1
        AND app_id = $2
        GROUP BY %s
        ORDER BY count DESC, value ASC`, column, column, column)
	results := []models.CountByKeyValue{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) GetSessionsPerDay(appId string, numberOfDays int) ([]models.SessionItem, error) {
	query := `
		SELECT
			EXTRACT(YEAR FROM timestamp) as year,
			EXTRACT(MONTH FROM timestamp) as month,
			EXTRACT(DAY FROM timestamp) as day,
			COUNT(DISTINCT session_id) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY year, month, day
		ORDER BY year, month, day;
	`
	results := []models.SessionItem{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) GetTopReferrers(appId string, numberOfDays int) ([]models.CountByReferrer, error) {
	query := `
		SELECT referrer, COUNT(*) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY referrer
		ORDER BY count DESC, referrer ASC
	`
	results := []models.CountByReferrer{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) GetHitsPerPage(appId string, numberOfDays int) ([]models.CountHitsPerPage, error) {
	query := `
		SELECT path, COUNT(*) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY path
		ORDER BY count DESC, path ASC
	`
	results := []models.CountHitsPerPage{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) GetUniqueSessionsPerPage(appId string, numberOfDays int) ([]models.CountHitsPerPage, error) {

	query := `
		SELECT path, COUNT(DISTINCT session_id) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY path
		ORDER BY count DESC, path ASC
	`
	results := []models.CountHitsPerPage{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) GetUniqueSessionsByCountry(appId string, numberOfDays int) ([]models.CountByCountry, error) {
	query := `
		SELECT country, COUNT(DISTINCT session_id) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY country
		ORDER BY count DESC, country ASC
	`
	results := []models.CountByCountry{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) GetStats(appId string, numberOfDays int) (models.Stats, error) {
	query := `
		SELECT 
		(
			SELECT COUNT(DISTINCT session_id)
			FROM events
			WHERE timestamp >= $1
			AND app_id = $2
		) as "uniqueVisitors",
		(
			select COUNT(path) as totalPageviews FROM events
			WHERE timestamp >= $1
			AND app_id = $2
		) as "totalPageviews",
		(
			SELECT AVG(viewsPerVisitor) FROM (
				SELECT session_id, COUNT(*) as viewsPerVisitor
				FROM events
				WHERE timestamp >= $1
				AND app_id = $2
				GROUP BY session_id
			) as subq
		) as "viewsPerVisitor"
	`
	var result models.Stats
	err := repo.Db.QueryRow(query, getDaysAgo(numberOfDays), appId).Scan(&result.UniqueVisitors, &result.TotalPageviews, &result.ViewsPerVisitor)
	if err != nil {
		return result, err
	}

	return result, nil
}

func (repo *PostgresRepo) HasAnyEvents(appId string) (bool, error) {
	if appId != "" {
		query := "select 1 from events where app_id = $1 limit 1"
		rows, err := repo.Db.Query(query, appId)
		if err != nil {
			return false, err
		}
		defer rows.Close()
		return rows.Next(), nil
	} else {
		query := "select 1 from events limit 1"
		rows, err := repo.Db.Query(query)
		if err != nil {
			return false, err
		}
		defer rows.Close()
		return rows.Next(), nil
	}

}

var allowedKeysUtm = map[string]string{
	"utm_source":   "utm_source",
	"utm_medium":   "utm_medium",
	"utm_campaign": "utm_campaign",
}

func (repo *PostgresRepo) GetSessionCountByUtmTag(appId string, key string, numberOfDays int) ([]models.CountByKeyValue, error) {

	column, ok := allowedKeysUtm[key]
	if !ok {
		log.Printf("Invalid key provided: %s", key)
		return nil, fmt.Errorf("invalid key provided")
	}
	query := fmt.Sprintf(`
		SELECT '%s' AS key, %s as value, COUNT(DISTINCT session_id) AS count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY %s
		ORDER BY count DESC, value ASC`, column, column, column)
	results := []models.CountByKeyValue{}
	repo.Db.Select(&results, query, getDaysAgo(numberOfDays), appId)
	return results, nil
}

func (repo *PostgresRepo) ListDataIo() ([]models.DataIo, error) {
	results := []models.DataIo{}
	query := `SELECT * FROM data_io`
	repo.Db.Select(&results, query)
	return results, nil
}

func (repo *PostgresRepo) DeleteDataIo(id string) error {
	query := `DELETE FROM data_io WHERE id = $1`
	_, err := repo.Db.Exec(query, id)
	return err
}

func (repo *PostgresRepo) ListApps() ([]models.App, error) {
	results := []models.App{}
	query := `SELECT * FROM apps`
	repo.Db.Select(&results, query)
	return results, nil
}

func (repo *PostgresRepo) CreateApp(name string) error {
	id := uuid.NewString()
	query := `INSERT INTO apps (id, name, urls) VALUES ($1, $2, $3)`
	_, err := repo.Db.Exec(query, id, name, "")
	return err
}

func (repo *PostgresRepo) UpdateApp(id string, name string) error {
	query := `UPDATE apps SET name = $1 WHERE id = $2`
	_, err := repo.Db.Exec(query, name, id)
	return err
}

func (repo *PostgresRepo) DeleteApp(id string) error {
	query := `DELETE FROM apps WHERE id = $1`
	_, err := repo.Db.Exec(query, id)
	return err
}

// StartExport initializes the export process by creating a new file and inserting a record into the data_io table.
func (repo *PostgresRepo) StartExport() error {
	newID := uuid.New().String()

	// create folder if it does not exist
	if _, err := os.Stat("exports"); os.IsNotExist(err) {
		os.Mkdir("exports", 0755)
	}

	filePath := fmt.Sprintf("./exports/%s.csv", newID)
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer file.Close()

	_, err = repo.Db.Exec(
		"INSERT INTO data_io (id, type, status, file_path) VALUES ($1, 'export', 'pending', $2)",
		newID, filePath,
	)
	if err != nil {
		return fmt.Errorf("failed to insert into data_io: %v", err)
	}

	go repo.performExport(filePath, newID) // Running in a goroutine for asynchronous execution
	return nil
}

func (repo *PostgresRepo) performExport(filePath string, id string) {
	log.Println("Starting export")
	const limit = 5000

	log.Printf("Starting export to %s\n", filePath)
	cursor := 0

	// Open the file in append mode, or create it if it does not exist
	file, err := os.OpenFile(filePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("Error opening file: %v\n", err)
		return
	}
	defer file.Close()

	// Create a CSV writer
	writer := csv.NewWriter(bufio.NewWriter(file))
	defer writer.Flush()

	// Write CSV header
	headers := []string{
		"ID",
		"AppID",
		"SessionID",
		"Path",
		"Timestamp",
		"IP",
		"UserAgent",
		"Referrer",
		"Language",
		"Country",
		"ScreenWidth",
		"ScreenHeight",
		"WindowWidth",
		"WindowHeight",
		"BotName",
		"BotCategory",
		"BotURL",
		"BotProducerName",
		"BotProducerURL",
		"ClientType",
		"ClientName",
		"ClientVersion",
		"ClientEngine",
		"ClientEngineVersion",
		"DeviceType",
		"DeviceBrand",
		"DeviceModel",
		"OSName",
		"OSVersion",
		"OSPlatform",
		"UtmSource",
		"UtmMedium",
		"UtmCampaign",
		"UtmTerm",
		"UtmContent",
	}
	if err := writer.Write(headers); err != nil {
		log.Printf("Error writing headers to CSV: %v", err)
		return
	}

	for {
		var rows []models.WebEvent
		query := "SELECT * FROM events WHERE id > $1 ORDER BY id ASC LIMIT $2"
		err := repo.Db.Select(&rows, query, cursor, limit)
		if err != nil {
			log.Printf("Error fetching events: %v\n", err)
			break
		}

		for _, row := range rows {
			record := []string{
				toIntString(row.ID),
				row.AppID,
				row.SessionID,
				row.Path,
				row.Timestamp.Format(time.RFC3339),
				row.IP,
				row.UserAgent,
				row.Referrer,
				row.Language,
				row.Country,
				toIntString(row.ScreenWidth),
				toIntString(row.ScreenHeight),
				toIntString(row.WindowWidth),
				toIntString(row.WindowHeight),
				row.BotName,
				row.BotCategory,
				row.BotURL,
				row.BotProducerName,
				row.BotProducerURL,
				row.ClientType,
				row.ClientName,
				row.ClientVersion,
				row.ClientEngine,
				row.ClientEngineVersion,
				row.DeviceType,
				row.DeviceBrand,
				row.DeviceModel,
				row.OSName,
				row.OSVersion,
				row.OSPlatform,
				row.UtmSource,
				row.UtmMedium,
				row.UtmCampaign,
				row.UtmTerm,
				row.UtmContent,
			}
			if err := writer.Write(record); err != nil {
				log.Printf("Error writing record to CSV: %v", err)
			}
		}
		writer.Flush()

		if len(rows) < limit {
			break
		}
		cursor = rows[len(rows)-1].ID
	}

	_, err = repo.Db.Exec("UPDATE data_io SET status = 'complete', file_path = $1 WHERE id = $2", filePath, id)
	if err != nil {
		log.Printf("Error updating data_io status: %v\n", err)
		return
	}
	log.Println("Export complete")
}

func toIntString(ptr int) string {
	if ptr != 0 {
		return fmt.Sprintf("%d", ptr)
	}
	return ""
}
