package migrations

import (
	"joinstorywise.com/api/db"
)

var CreateEventsAppIDIndexMigration = Migration{
	ID: "004_indexes",
	Execute: func(repo *db.PostgresRepo) error {
		_, err := repo.Db.Exec(`
			CREATE INDEX IF NOT EXISTS idx_events_app_id ON events (app_id);
		`)
		if err != nil {
			return err
		}

		return nil
	},
}
