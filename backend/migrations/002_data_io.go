package migrations

import "joinstorywise.com/api/db"

var DataIoMigration = Migration{
	ID: "002_data_io",
	Execute: func(repo *db.PostgresRepo) error {
		_, err := repo.Db.Exec(`
			CREATE TABLE IF NOT EXISTS data_io (
				id UUID PRIMARY KEY,
				type TEXT NOT NULL,
				status TEXT NOT NULL,
				created_at TIMESTAMP NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
				file_path TEXT,
				data JSONB
			);
		`)
		if err != nil {
			return err
		}

		return nil
	},
}
