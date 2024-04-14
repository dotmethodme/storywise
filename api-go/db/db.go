package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"joinstorywise.com/api/models"
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

	db, err := sqlx.Connect("postgres", dbUrl)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	// Additional setup like SSL mode can be added here based on your environment

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

func (repo *PostgresRepo) ListApps() ([]models.App, error) {
	results := []models.App{}
	query := `SELECT * FROM apps`
	repo.Db.Select(&results, query)
	return results, nil
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

// Javascript version that I'm migrating away from:
// async listDataIo() {
//     const results: DataIo[] = await this.sql`select * from data_io`;
//     return results;
//   }

//   async deleteDataIo(id: string) {
//     await this.sql`delete from data_io where id = ${id}`;
//   }

//   public async listApps() {
//     const result: App[] = await this.sql`select * from apps`;
//     return result;
//   }

//   public async createApp(name: string) {
//     const id = this.uid.randomUUID();
//     await this.sql`insert into apps (id, name, urls) values (${id}, ${name}, ${""})`;
//   }

//   public async updateApp(id: string, name: string) {
//     await this.sql`update apps set name = ${name} where id = ${id}`;
//   }

//   public async deleteApp(id: string) {
//     await this.sql`delete from apps where id = ${id}`;
//   }

func (repo *PostgresRepo) ListDataIo() ([]models.DataIo, error) {
	results := []models.DataIo{}
	query := `SELECT * FROM data_io`
	repo.Db.Select(&results, query)
	return results, nil
}
