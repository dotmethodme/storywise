package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

type PostgresRepo struct {
	db *sql.DB
}

func NewPostgresRepo() *PostgresRepo {
	dbUrl := os.Getenv("POSTGRES_URL")
	if dbUrl == "" {
		log.Fatal("POSTGRES_URL is not set")
	}

	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Additional setup like SSL mode can be added here based on your environment

	return &PostgresRepo{db: db}
}

func getDaysAgo(days int) time.Time {
	now := time.Now()
	daysAgo := now.AddDate(0, 0, -days)
	daysAgo = time.Date(daysAgo.Year(), daysAgo.Month(), daysAgo.Day(), 0, 0, 0, 0, time.UTC)
	return daysAgo
}

var allowedKeys = map[string]string{
	"client_type":  "client_type",
	"client_name":  "client_name",
	"device_type":  "device_type",
	"device_brand": "device_brand",
	"os_name":      "os_name",
}

func (repo *PostgresRepo) GetSessionCountByUserAgent(appId string, key string, numberOfDays int) ([]CountByKeyValue, error) {
	results := []CountByKeyValue{}

	column, ok := allowedKeys[key]
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

	log.Println(query, key, getDaysAgo(numberOfDays), appId)

	rows, err := repo.db.Query(query, getDaysAgo(numberOfDays), appId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var result CountByKeyValue
		if err := rows.Scan(&result.Key, &result.Value, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}

func (repo *PostgresRepo) GetSessionsPerDay(appId string, numberOfDays int) ([]SessionItem, error) {
	results := []SessionItem{}

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

	rows, err := repo.db.Query(query, getDaysAgo(numberOfDays), appId)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var result SessionItem
		if err := rows.Scan(&result.Year, &result.Month, &result.Day, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}

func (repo *PostgresRepo) GetTopReferrers(appId string, numberOfDays int) ([]CountByReferrer, error) {
	results := []CountByReferrer{}

	query := `
		SELECT referrer, COUNT(*) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY referrer
		ORDER BY count DESC, referrer ASC
	`

	log.Println(query, getDaysAgo(numberOfDays), appId)
	rows, err := repo.db.Query(query, getDaysAgo(numberOfDays), appId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var result CountByReferrer
		if err := rows.Scan(&result.Referrer, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}

func (repo *PostgresRepo) GetHitsPerPage(appId string, numberOfDays int) ([]CountHitsPerPage, error) {
	results := []CountHitsPerPage{}

	query := `
		SELECT path, COUNT(*) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY path
		ORDER BY count DESC, path ASC
	`

	log.Println(query, getDaysAgo(numberOfDays), appId)
	rows, err := repo.db.Query(query, getDaysAgo(numberOfDays), appId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var result CountHitsPerPage
		if err := rows.Scan(&result.Path, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}

func (repo *PostgresRepo) GetUniqueSessionsPerPage(appId string, numberOfDays int) ([]CountHitsPerPage, error) {
	results := []CountHitsPerPage{}

	query := `
		SELECT path, COUNT(DISTINCT session_id) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY path
		ORDER BY count DESC, path ASC
	`

	log.Println(query, getDaysAgo(numberOfDays), appId)
	rows, err := repo.db.Query(query, getDaysAgo(numberOfDays), appId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var result CountHitsPerPage
		if err := rows.Scan(&result.Path, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}
