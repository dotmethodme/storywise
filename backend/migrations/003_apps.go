package migrations

import (
	"joinstorywise.com/api/db"
)

var AppsTableMigration = Migration{
	ID: "003_apps",
	Execute: func(repo *db.PostgresRepo) error {

		_, err := repo.Db.Exec(`
			CREATE TABLE IF NOT EXISTS apps (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				urls TEXT,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
		`)
		if err != nil {
			return err
		}

		_, err = repo.Db.Exec(`
			INSERT INTO apps (id, name, urls)
			VALUES ('default', 'Default', '')
			ON CONFLICT (id) DO NOTHING;
		`)
		if err != nil {
			return err
		}

		_, err = repo.Db.Exec(`
			ALTER TABLE events
			ADD COLUMN IF NOT EXISTS app_id TEXT REFERENCES apps(id) NOT NULL DEFAULT 'default';
		`)
		if err != nil {
			return err
		}

		return nil
	},
}
