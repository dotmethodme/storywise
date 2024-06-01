package migrations

import (
	"joinstorywise.com/api/db"
)

var AddEventIdsMigration = Migration{
	ID: "006_event_ids",
	Execute: func(repo *db.PostgresRepo) error {
		_, err := repo.Db.Exec(`
			ALTER TABLE events
			ADD COLUMN IF NOT EXISTS id SERIAL;
		`)
		if err != nil {
			return err
		}

		return nil
	},
}
