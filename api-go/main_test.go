package main

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/routes"
)

func setup(t *testing.T) (*db.PostgresRepo, *fiber.App) {
	t.Setenv("POSTGRES_URL", "postgresql://postgres:testing@localhost:5444/postgres?sslmode=disable")
	t.Setenv("TOTALLY_INSECURE_MODE_WITH_NO_PASSWORD", "true")
	pg := db.NewPostgresRepo()
	app := routes.CreateApp(pg)
	return pg, app
}

func TestHealth(t *testing.T) {
	_, app := setup(t)

	req := httptest.NewRequest("GET", "/api/health", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 200, but got %d", resp.StatusCode)
	}
}

// code from nodejs:
// const app = getApp();

// const app_id = "default";

// const health = await supertest(app).get("/health").expect(200);
// expect(health.body.healthy).toBe(true);

// const sessionsPerDay = await supertest(app)
//   .get(`/admin/api/sessions_per_day?app_id=${app_id}`)
//   .auth(user, pass)
//   .expect(200);
// for (const item of sessionsPerDay.body) {
//   expect(item.count).toBeDefined();
//   expect(item.year).toBeDefined();
//   expect(item.month).toBeDefined();
//   expect(item.day).toBeDefined();
// }

// translated to go:

func TestSessionsPerDay(t *testing.T) {
	_, app := setup(t)

	req := httptest.NewRequest("GET", "/admin/api/sessions_per_day?app_id=default", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 200, but got %d", resp.StatusCode)
	}

}
