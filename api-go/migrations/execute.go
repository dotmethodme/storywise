package migrations

import (
	"log"

	"joinstorywise.com/api/db"
)

type Migration struct {
	ID      string
	Execute func(repo *db.PostgresRepo) error
}

var AllMigrations = []Migration{
	BasicSchemaMigration,
	DataIoMigration,
	AppsTableMigration,
	CreateEventsAppIDIndexMigration,
	AddUTMColumnsMigration,
	AddEventIdsMigration,
}

func ExecuteAll(repo *db.PostgresRepo) {
	ensureMigrationTable(repo)

	for _, migration := range AllMigrations {
		status := GetMigrationStatus(repo, migration.ID)

		if status == "success" {
			continue
		}

		if status == "error" {
			log.Fatalf("Migration %s previously failed", migration.ID)
		}

		err := migration.Execute(repo)
		if err != nil {
			acknowledgeMigration(repo, migration.ID, "error")
			log.Fatalf("Migration %s failed: %s", migration.ID, err)
		} else {
			acknowledgeMigration(repo, migration.ID, "success")
			log.Printf("Migration %s executed", migration.ID)
		}
	}
}

func ensureMigrationTable(repo *db.PostgresRepo) {
	_, err := repo.Db.Exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      timestamp TIMESTAMP NOT NULL
    );
  `)
	if err != nil {
		panic(err)
	}
}

func acknowledgeMigration(repo *db.PostgresRepo, name string, status string) {
	_, err := repo.Db.Exec(`
    INSERT INTO migrations (name, status, timestamp)
    VALUES ($1, $2, NOW());
  `, name, status)
	if err != nil {
		panic(err)
	}
}

func GetMigrationStatus(repo *db.PostgresRepo, name string) string {
	var status string
	err := repo.Db.QueryRow(`SELECT status FROM migrations WHERE name = $1`, name).Scan(&status)
	if err != nil {
		return "not_executed"
	}
	return status
}
