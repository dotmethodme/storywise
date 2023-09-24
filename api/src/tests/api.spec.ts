import supertest from "supertest";
import { getApp } from "../app";
import { MongoRepo } from "../repository/mongo";
import { PostgresRepo } from "../repository/postgres";
import { clearRepo, getLibsqlRepo, getMongoRepo, getPostgresRepo, getTimescaleRepo } from "../repository/repo";
import { seedDemo } from "../scripts/seedDemo";
import { mongoUrlMock, postgresUrlMock, libsqlUrlMock, timescaleUrlMock } from "./helpers/constants";
import { LibsqlRepo } from "../repository/libsql";
import { TimescaleRepo } from "../repository/timescale";

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
      await seedDemo(false, 10, 50);
    });

    afterEach(async () => {
      await repo.sql`DROP TABLE IF EXISTS events;`;
      await repo.sql`DROP TABLE IF EXISTS migrations;`;
      await repo.sql`DROP TABLE IF EXISTS data_io;`;
      await repo.disconnect();
      clearRepo();
      process.env = OLD_ENV; // Restore old environment
    });

    test("API smoke tests", apiSmokeTests);
  });

  describe("Timescale", () => {
    let repo: TimescaleRepo;
    const OLD_ENV = process.env;

    beforeEach(async () => {
      jest.resetModules();
      process.env = { ...OLD_ENV };

      process.env.TIMESCALEDB_URL = timescaleUrlMock;
      process.env.STORYWISE_USERNAME = user;
      process.env.STORYWISE_PASSWORD = pass;

      const migration = await import("../migrations/timescale");
      await migration.migrateTimescaleDB();
      repo = getTimescaleRepo();
      await repo.connect();
      await seedDemo(false, 10, 50);
    });

    afterEach(async () => {
      await repo.sql`DROP TABLE IF EXISTS events;`;
      await repo.sql`DROP TABLE IF EXISTS migrations;`;
      await repo.sql`DROP TABLE IF EXISTS data_io;`;
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
      await seedDemo(false, 10, 50);
    });

    afterEach(async () => {
      await repo.db().collection("events").drop();
      await repo.db().collection("migrations").drop();
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
      process.env.LIBSQL_SSL_DISABLE = "true";
      process.env.STORYWISE_USERNAME = user;
      process.env.STORYWISE_PASSWORD = pass;

      const migration = await import("../migrations/libsql");
      await migration.migrateLibsql();
      repo = getLibsqlRepo();
      await repo.connect();
      await seedDemo(false, 10, 50);
    });

    afterEach(async () => {
      await repo.db().execute(`DROP TABLE events;`);
      await repo.db().execute(`DROP TABLE migrations;`);
      await repo.db().execute(`DROP TABLE data_io;`);
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

  const countByUserAgentClientType = await supertest(app)
    .get("/admin/api/count_sessions_by_user_agent?key=client_type")
    .auth(user, pass)
    .expect(200);
  for (const item of countByUserAgentClientType.body) {
    expect(item.count).toBeDefined();
    expect(item.value).toBeDefined();
    expect(item.key).toBeDefined();
    expect(item.key).toEqual("client_type");
  }

  const countByUserAgentClientName = await supertest(app)
    .get("/admin/api/count_sessions_by_user_agent?key=client_name")
    .auth(user, pass)
    .expect(200);
  for (const item of countByUserAgentClientName.body) {
    expect(item.count).toBeDefined();
    expect(item.value).toBeDefined();
    expect(item.key).toBeDefined();
    expect(item.key).toEqual("client_name");
  }

  const countByUserAgentDeviceType = await supertest(app)
    .get("/admin/api/count_sessions_by_user_agent?key=device_type")
    .auth(user, pass)
    .expect(200);
  for (const item of countByUserAgentDeviceType.body) {
    expect(item.count).toBeDefined();
    expect(item.value).toBeDefined();
    expect(item.key).toBeDefined();
    expect(item.key).toEqual("device_type");
  }

  const countByUserAgentDeviceBrand = await supertest(app)
    .get("/admin/api/count_sessions_by_user_agent?key=device_brand")
    .auth(user, pass)
    .expect(200);
  for (const item of countByUserAgentDeviceBrand.body) {
    expect(item.count).toBeDefined();
    expect(item.value).toBeDefined();
    expect(item.key).toBeDefined();
    expect(item.key).toEqual("device_brand");
  }

  const countByUserAgentOsName = await supertest(app)
    .get("/admin/api/count_sessions_by_user_agent?key=os_name")
    .auth(user, pass)
    .expect(200);
  for (const item of countByUserAgentOsName.body) {
    expect(item.count).toBeDefined();
    expect(item.value).toBeDefined();
    expect(item.key).toBeDefined();
    expect(item.key).toEqual("os_name");
  }
}
