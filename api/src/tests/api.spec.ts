import supertest from "supertest";
import { getApp } from "../app";
import { MongoRepo } from "../repository/mongo";
import { PostgresRepo } from "../repository/postgres";
import { clearRepo, getLibsqlRepo, getMongoRepo, getPostgresRepo } from "../repository/repo";
import { seedDemo } from "../scripts/seedDemo";
import { mongoUrlMock, postgresUrlMock, libsqlUrlMock } from "./helpers/constants";
import { LibsqlRepo } from "../repository/libsql";

const user = "admin";
const pass = "123";

describe("API tests", () => {
  jest.setTimeout(60000);

  describe("Postgres", () => {
    let repo: PostgresRepo;
    const OLD_ENV = process.env;

    beforeEach(async () => {
      jest.resetModules();
      process.env = { ...OLD_ENV };

      process.env.POSTGRES_URL = postgresUrlMock;
      process.env.STORYWISE_USERNAME = user;
      process.env.STORYWISE_PASSWORD = pass;

      const migration = await import("../migrations/postgres");
      await migration.migratePostgres();
      repo = getPostgresRepo();
      await repo.connect();
      await seedDemo(false);
    });

    afterEach(async () => {
      await repo.sql`DROP TABLE IF EXISTS events;`;
      await repo.sql`DROP TABLE IF EXISTS migrations;`;
      await repo.disconnect();
      clearRepo();
      process.env = OLD_ENV; // Restore old environment
    });

    test("API smoke tests", apiSmokeTests);
  });

  describe("MongoDB", () => {
    let repo: MongoRepo;
    const OLD_ENV = process.env;

    beforeEach(async () => {
      jest.resetModules();
      process.env = { ...OLD_ENV };

      process.env.MONGODB_URI = mongoUrlMock;
      process.env.STORYWISE_USERNAME = user;
      process.env.STORYWISE_PASSWORD = pass;

      const migration = await import("../migrations/mongo");
      await migration.migrateMongo();
      repo = getMongoRepo();
      await repo.connect();
      await seedDemo(false);
    });

    afterEach(async () => {
      await repo.db().dropCollection("events");
      await repo.db().dropCollection("migrations");
      await repo.disconnect();
      clearRepo();
      process.env = OLD_ENV; // Restore old environment
    });

    test("API smoke tests", apiSmokeTests);
  });

  describe("LibSQL", () => {
    let repo: LibsqlRepo;
    const OLD_ENV = process.env;

    beforeEach(async () => {
      jest.resetModules();
      process.env = { ...OLD_ENV };

      process.env.LIBSQL_URL = libsqlUrlMock;
      process.env.LIBSQL_TOKEN = "testing";
      process.env.LIBSQL_TLS_DISABLE = "true";
      process.env.STORYWISE_USERNAME = user;
      process.env.STORYWISE_PASSWORD = pass;

      const migration = await import("../migrations/libsql");
      await migration.migrateLibsql();
      repo = getLibsqlRepo();
      await repo.connect();
      await seedDemo(false);
    });

    afterEach(async () => {
      await repo.db().execute(`DROP TABLE events;`);
      await repo.db().execute(`DROP TABLE migrations;`);
      await repo.disconnect();
      clearRepo();
      process.env = OLD_ENV; // Restore old environment
    });

    test("API smoke tests", apiSmokeTests);
  });
});

async function apiSmokeTests() {
  const app = getApp();

  const health = await supertest(app).get("/health").expect(200);
  expect(health.body.healthy).toBe(true);

  const sessionsPerDay = await supertest(app).get("/admin/api/sessions_per_day").auth(user, pass).expect(200);
  for (const item of sessionsPerDay.body) {
    expect(item.count).toBeDefined();
    expect(item.year).toBeDefined();
    expect(item.month).toBeDefined();
    expect(item.day).toBeDefined();
  }

  const hitsPerPage = await supertest(app).get("/admin/api/hits_per_page").auth(user, pass).expect(200);
  for (const item of hitsPerPage.body) {
    expect(item.count).toBeDefined();
    expect(item.path).toBeDefined();
  }

  const uniqueSessionsPerPage = await supertest(app).get("/admin/api/unique_sessions_per_page").expect(200);
  for (const item of uniqueSessionsPerPage.body) {
    expect(item.count).toBeDefined();
    expect(item.path).toBeDefined();
  }

  const topReferrers = await supertest(app).get("/admin/api/top_referrers").auth(user, pass).expect(200);
  for (const item of topReferrers.body) {
    expect(item.count).toBeDefined();
    expect(item.referrer).toBeDefined();
  }

  const uniqueSessionsByCountry = await supertest(app)
    .get("/admin/api/unique_sessions_by_country")
    .auth(user, pass)
    .expect(200);
  for (const item of uniqueSessionsByCountry.body) {
    expect(item.count).toBeDefined();
    expect(item.country).toBeDefined();
  }

  const stats = await supertest(app).get("/admin/api/stats").auth(user, pass).expect(200);
  expect(stats.body.uniqueVisitors).toBeDefined();
  expect(stats.body.totalPageviews).toBeDefined();
  expect(stats.body.viewsPerVisitor).toBeDefined();
}
