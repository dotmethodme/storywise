package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/migrations"
	"joinstorywise.com/api/routes"
)

func main() {
	loadDotEnv()

	// Setup
	port := os.Getenv("PORT")
	pg := db.NewPostgresRepo()
	migrations.ExecuteAll(pg)

	app := routes.CreateApp(pg)

	// Start server
	log.Fatal(app.Listen(":" + port))
}

func loadDotEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Did not load .env file. Using system environment variables.")
	}
}
