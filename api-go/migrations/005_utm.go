package migrations

import (
	"joinstorywise.com/api/db"
)

var AddUTMColumnsMigration = Migration{
	ID: "005_utm",
	Execute: func(repo *db.PostgresRepo) error {
		_, err := repo.Db.Exec(`
			ALTER TABLE events
			ADD COLUMN IF NOT EXISTS utm_source TEXT,
			ADD COLUMN IF NOT EXISTS utm_medium TEXT,
			ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
			ADD COLUMN IF NOT EXISTS utm_term TEXT,
			ADD COLUMN IF NOT EXISTS utm_content TEXT;
		`)
		if err != nil {
			return err
		}

		return nil
	},
}
