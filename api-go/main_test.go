package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"joinstorywise.com/api/db"
	"joinstorywise.com/api/models"
	"joinstorywise.com/api/routes"
	"joinstorywise.com/api/scripts"
)

func setup(t *testing.T) (*db.PostgresRepo, *fiber.App) {
	t.Setenv("API_BASE_URL", "http://foobar:3000")
	t.Setenv("POSTGRES_URL", "postgresql://postgres:testing@localhost:5566/postgres?sslmode=disable")
	t.Setenv("TIMESCALE_ENABLED", "true")
	t.Setenv("TOTALLY_INSECURE_MODE_WITH_NO_PASSWORD", "true")
	pg := db.NewPostgresRepo()
	app := routes.CreateApp(pg)
	return pg, app
}

func TestHealth(t *testing.T) {
	_, app := setup(t)
	scripts.SeedDemo(30)

	req := httptest.NewRequest("GET", "/api/health", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 200, but got %d", resp.StatusCode)
	}
}

func TestSessionsPerDay(t *testing.T) {
	_, app := setup(t)
	scripts.SeedDemo(30)

	req1 := httptest.NewRequest("GET", "/admin/api/sessions_per_day?app_id=default", nil)
	resp2, _ := app.Test(req1)

	assert.Equal(t, 200, resp2.StatusCode)

	resp2Json := map[string]interface{}{}
	json.NewDecoder(resp2.Body).Decode(&resp2Json)
	assert.NotNil(t, resp2Json["items"])
	items := resp2Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["year"])
		assert.NotNil(t, itemMap["month"])
		assert.NotNil(t, itemMap["day"])
	}

	req2 := httptest.NewRequest("GET", "/admin/api/hits_per_page?app_id=default", nil)
	resp2, _ = app.Test(req2)

	assert.Equal(t, 200, resp2.StatusCode)

	resp2Json = map[string]interface{}{}
	json.NewDecoder(resp2.Body).Decode(&resp2Json)
	assert.NotNil(t, resp2Json["items"])
	items = resp2Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["path"])
	}

	req3 := httptest.NewRequest("GET", "/admin/api/unique_sessions_per_page?app_id=default", nil)
	resp3, _ := app.Test(req3)

	assert.Equal(t, 200, resp3.StatusCode)

	resp3Json := map[string]interface{}{}
	json.NewDecoder(resp3.Body).Decode(&resp3Json)
	assert.NotNil(t, resp3Json["items"])
	items = resp3Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["path"])
	}

	req4 := httptest.NewRequest("GET", "/admin/api/top_referrers?app_id=default", nil)
	resp4, _ := app.Test(req4)

	assert.Equal(t, 200, resp4.StatusCode)

	resp4Json := map[string]interface{}{}
	json.NewDecoder(resp4.Body).Decode(&resp4Json)
	assert.NotNil(t, resp4Json["items"])
	items = resp4Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["referrer"])
	}

	req5 := httptest.NewRequest("GET", "/admin/api/unique_sessions_by_country?app_id=default", nil)
	resp5, _ := app.Test(req5)

	assert.Equal(t, 200, resp5.StatusCode)

	resp5Json := map[string]interface{}{}
	json.NewDecoder(resp5.Body).Decode(&resp5Json)
	assert.NotNil(t, resp5Json["items"])
	items = resp5Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["country"])
	}

	req6 := httptest.NewRequest("GET", "/admin/api/stats?app_id=default", nil)
	resp6, _ := app.Test(req6)

	assert.Equal(t, 200, resp6.StatusCode)

	resp6Json := map[string]interface{}{}
	json.NewDecoder(resp6.Body).Decode(&resp6Json)
	resp6Item := resp6Json["item"].(map[string]interface{})
	assert.NotNil(t, resp6Item["uniqueVisitors"])
	assert.NotNil(t, resp6Item["totalPageviews"])
	assert.NotNil(t, resp6Item["viewsPerVisitor"])

	req7 := httptest.NewRequest("GET", "/admin/api/count_sessions_by_user_agent?key=client_type&app_id=default", nil)
	resp7, _ := app.Test(req7)

	assert.Equal(t, 200, resp7.StatusCode)

	resp7Json := map[string]interface{}{}
	json.NewDecoder(resp7.Body).Decode(&resp7Json)
	assert.NotNil(t, resp7Json)
	items = resp7Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["value"])
		assert.NotNil(t, itemMap["key"])
		assert.Equal(t, "client_type", itemMap["key"])
	}

	req8 := httptest.NewRequest("GET", "/admin/api/count_sessions_by_user_agent?key=client_name&app_id=default", nil)
	resp8, _ := app.Test(req8)

	assert.Equal(t, 200, resp8.StatusCode)

	resp8Json := map[string]interface{}{}
	json.NewDecoder(resp8.Body).Decode(&resp8Json)
	assert.NotNil(t, resp8Json)
	items = resp8Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["value"])
		assert.NotNil(t, itemMap["key"])
		assert.Equal(t, "client_name", itemMap["key"])
	}

	req9 := httptest.NewRequest("GET", "/admin/api/count_sessions_by_user_agent?key=device_type&app_id=default", nil)
	resp9, _ := app.Test(req9)

	assert.Equal(t, 200, resp9.StatusCode)

	resp9Json := map[string]interface{}{}
	json.NewDecoder(resp9.Body).Decode(&resp9Json)
	assert.NotNil(t, resp9Json)
	items = resp9Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["value"])
		assert.NotNil(t, itemMap["key"])
		assert.Equal(t, "device_type", itemMap["key"])
	}

	req10 := httptest.NewRequest("GET", "/admin/api/count_sessions_by_user_agent?key=device_brand&app_id=default", nil)
	resp10, _ := app.Test(req10)

	assert.Equal(t, 200, resp10.StatusCode)

	resp10Json := map[string]interface{}{}
	json.NewDecoder(resp10.Body).Decode(&resp10Json)

	assert.NotNil(t, resp10Json)
	items = resp10Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["value"])
		assert.NotNil(t, itemMap["key"])
		assert.Equal(t, "device_brand", itemMap["key"])
	}

	req11 := httptest.NewRequest("GET", "/admin/api/count_sessions_by_user_agent?key=os_name&app_id=default", nil)
	resp11, _ := app.Test(req11)

	assert.Equal(t, 200, resp11.StatusCode)

	resp11Json := map[string]interface{}{}
	json.NewDecoder(resp11.Body).Decode(&resp11Json)
	assert.NotNil(t, resp11Json)
	items = resp11Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.NotNil(t, itemMap["value"])
		assert.NotNil(t, itemMap["key"])
		assert.Equal(t, "os_name", itemMap["key"])
	}

	req12 := httptest.NewRequest("GET", "/admin/api/count_sessions_by_utm?key=utm_source&app_id=default", nil)
	resp12, _ := app.Test(req12)

	assert.Equal(t, 200, resp12.StatusCode)

	resp12Json := map[string]interface{}{}
	json.NewDecoder(resp12.Body).Decode(&resp12Json)
	assert.NotNil(t, resp12Json)
	items = resp12Json["items"].([]interface{})
	for _, item := range items {
		itemMap := item.(map[string]interface{})
		assert.NotNil(t, itemMap["count"])
		assert.Contains(t, itemMap, "value")
		assert.NotNil(t, itemMap["key"])
		assert.Equal(t, "utm_source", itemMap["key"])
	}
}

func TestEvents(t *testing.T) {
	pg, app := setup(t)
	scripts.CleanDb()

	// Broken
	req1 := httptest.NewRequest("POST", "/api/event", nil)
	resp1, _ := app.Test(req1)
	assert.Equal(t, 400, resp1.StatusCode)

	// Working
	req2 := httptest.NewRequest("POST", "/api/event", createEvent(map[string]interface{}{
		"app_id":        "default",
		"path":          "/testinnng",
		"screen_width":  100,
		"screen_height": 100,
		"utm_source":    "test",
		"referrer":      "asd",
	}))
	resp2, _ := app.Test(req2)
	assert.Equal(t, 204, resp2.StatusCode)

	// Check inside the database
	var rows []models.WebEventRead
	err := pg.Db.Select(&rows, "SELECT * FROM events order by id desc")
	assert.Nil(t, err)
	assert.NotNil(t, rows)
	row := rows[0]
	assert.Nil(t, err)
	assert.Equal(t, "default", *row.AppID)
	assert.Equal(t, "/testinnng", *row.Path)
	assert.Equal(t, 100, *row.ScreenWidth)
	assert.Equal(t, 100, *row.ScreenHeight)

	// Working with a different event
	req3 := httptest.NewRequest("POST", "/api/event", createEvent(map[string]interface{}{
		"app_id": "default",
		"path":   "/testinnng2",
	}))
	resp3, _ := app.Test(req3)
	assert.Equal(t, 204, resp3.StatusCode)

	// Check inside the database
	err = pg.Db.Select(&rows, "SELECT * FROM events order by id desc")
	assert.Nil(t, err)
	assert.NotNil(t, rows)
	row = rows[0]
	assert.Nil(t, err)
	assert.Equal(t, "default", *row.AppID)
	assert.Equal(t, "/testinnng2", *row.Path)
	assert.Equal(t, 0, *row.ScreenWidth)
	assert.Equal(t, 0, *row.ScreenHeight)

	// Working with a different event
	req4 := httptest.NewRequest("POST", "/api/event", createEvent(map[string]interface{}{
		"app_id":   "default",
		"path":     "/testinnng3",
		"referrer": "asd",
	}))
	resp4, _ := app.Test(req4)
	assert.Equal(t, 204, resp4.StatusCode)

	// Check inside the database
	err = pg.Db.Select(&rows, "SELECT * FROM events order by id desc")
	assert.Nil(t, err)
	assert.NotNil(t, rows)
	row = rows[0]
	assert.Nil(t, err)
	assert.Equal(t, "default", *row.AppID)
	assert.Equal(t, "/testinnng3", *row.Path)
	assert.Equal(t, 0, *row.ScreenWidth)
	assert.Equal(t, 0, *row.ScreenHeight)
	assert.Equal(t, "asd", *row.Referrer)
}

func createEvent(input map[string]interface{}) *bytes.Buffer {
	buffer := new(bytes.Buffer)
	json.NewEncoder(buffer).Encode(input)
	return buffer
}

func TestScriptFile(t *testing.T) {
	_, app := setup(t)

	req := httptest.NewRequest("GET", "/js/script.js", nil)
	resp, _ := app.Test(req)

	assert.Equal(t, 200, resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}
	defer resp.Body.Close()

	assert.Contains(t, string(body), "http://foobar:3000")
}
