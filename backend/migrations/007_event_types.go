package migrations

import (
	"joinstorywise.com/api/db"
)

var AddEventTypeMigration = Migration{
	ID: "007_event_types",
	Execute: func(repo *db.PostgresRepo) error {
		_, err := repo.Db.Exec(`
			ALTER TABLE events
			ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'pageview';
		`)
		if err != nil {
			return err
		}

		return nil
	},
}
