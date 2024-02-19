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
	return time.Now().AddDate(0, 0, -days)
}

func (repo *PostgresRepo) GetSessionCountByUserAgent(appId string, key string, numberOfDays int) ([]CountByKeyValue, error) {
	results := []CountByKeyValue{}
	allowedKeys := map[string]string{
		"device_type": "device_type",
		// Add more mappings as needed
	}

	column, ok := allowedKeys[key]
	if !ok {
		log.Printf("Invalid key provided: %s", key)
		return nil, fmt.Errorf("invalid key provided")
	}

	query := fmt.Sprintf(`
        SELECT "%s" AS key, %s as value, COUNT(DISTINCT session_id) AS count
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
