package scripts

import (
	"joinstorywise.com/api/db"
)

func CleanDb() {
	repo := db.NewPostgresRepo()
	repo.Db.Exec("TRUNCATE TABLE events")
}
