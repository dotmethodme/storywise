import { Application } from "express";
import supertest from "supertest";
import { getApp } from "../app";
import { PostgresRepo } from "../repository/postgres";
import { getPostgresRepo } from "../repository/repo";
import { postgresUrlMock } from "./helpers/constants";
import { migrate } from "../migrations/migrations";
import { seedDemo } from "../scripts/seedDemo";
import exp from "constants";

const user = "admin";
const pass = "123";

describe("Postgres", () => {
  let app: Application;
  let repo: PostgresRepo;

  const OLD_ENV = process.env;

  beforeAll(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy

    process.env.POSTGRES_URL = postgresUrlMock;
    process.env.STORYWISE_USERNAME = user;
    process.env.STORYWISE_PASSWORD = pass;

    const migration = await import("../migrations/postgres");
    await migration.migratePostgres();
    repo = getPostgresRepo();
    await repo.connect();
    await seedDemo(false);

    app = getApp();
  });

  afterAll(async () => {
    process.env = OLD_ENV; // Restore old environment
    await teardown(repo);
    await repo.disconnect();
  });

  test("smoke tests", async () => {
    const health = await supertest(app).get("/health").expect(200);
    expect(health.body.healthy).toBe(true);

    const sessionsPerDay = await supertest(app).get("/admin/api/sessions_per_day").auth(user, pass).expect(200);
    for (const item of sessionsPerDay.body) {
      expect(item.count).toBeDefined();
      expect(item.year).toBeDefined();
      expect(item.month).toBeDefined();
      expect(item.day).toBeDefined();
    }
  });
});

async function teardown(repo: PostgresRepo) {
  await repo.sql`DROP TABLE IF EXISTS events;`;
  await repo.sql`DROP TABLE IF EXISTS migrations;`;
}
