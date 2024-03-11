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

var allowedKeysUserAgent = map[string]string{
	"client_type":  "client_type",
	"client_name":  "client_name",
	"device_type":  "device_type",
	"device_brand": "device_brand",
	"os_name":      "os_name",
}

func (repo *PostgresRepo) GetSessionCountByUserAgent(appId string, key string, numberOfDays int) ([]CountByKeyValue, error) {
	results := []CountByKeyValue{}

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

func (repo *PostgresRepo) GetUniqueSessionsByCountry(appId string, numberOfDays int) ([]CountByCountry, error) {
	results := []CountByCountry{}

	query := `
		SELECT country, COUNT(DISTINCT session_id) as count
		FROM events
		WHERE timestamp >= $1
		AND app_id = $2
		GROUP BY country
		ORDER BY count DESC, country ASC
	`

	rows, err := repo.db.Query(query, getDaysAgo(numberOfDays), appId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var result CountByCountry
		if err := rows.Scan(&result.Country, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}

func (repo *PostgresRepo) GetStats(appId string, numberOfDays int) (Stats, error) {
	var result Stats

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

	err := repo.db.QueryRow(query, getDaysAgo(numberOfDays), appId).Scan(&result.UniqueVisitors, &result.TotalPageviews, &result.ViewsPerVisitor)
	if err != nil {
		return result, err
	}

	result.ViewsPerVisitor = float32(int(result.ViewsPerVisitor*100)) / 100

	return result, nil
}

func (repo *PostgresRepo) ListApps() ([]App, error) {
	results := []App{}

	query := `SELECT * FROM apps`

	rows, err := repo.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var result App
		if err := rows.Scan(&result.ID, &result.Name, &result.URLs, &result.CreatedAt, &result.UpdatedAt); err != nil {
			return nil, err
		}
		results = append(results, result)
	}

	return results, nil
}

func (repo *PostgresRepo) HasAnyEvents(appId string) (bool, error) {
	if appId != "" {
		query := "select 1 from events where app_id = $1 limit 1"
		rows, err := repo.db.Query(query, appId)
		if err != nil {
			return false, err
		}
		defer rows.Close()

		return rows.Next(), nil
	} else {
		query := "select 1 from events limit 1"
		rows, err := repo.db.Query(query)
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

func (repo *PostgresRepo) GetSessionCountByUtmTag(appId string, key string, numberOfDays int) ([]CountByKeyValue, error) {
	results := []CountByKeyValue{}

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
