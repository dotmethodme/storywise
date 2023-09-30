import { getTimescaleRepo } from "../repository/repo";
import { Migration } from "../types/migrations";

export async function migrateTimescaleDB() {
  console.log("Trying to run database migrations:");

  await ensureMigrationsTable();

  let newMigrations = false;

  const appliedMigrations = await getMigrations();

  const migrations = await import("./timescale/index");

  const keys = Object.keys(migrations) as (keyof typeof migrations)[];

  for (const key of keys) {
    const migration = migrations[key].default;
    const isApplied = appliedMigrations.some((m) => m.name === key);

    if (!isApplied) {
      console.log(`Applying ${key}...`);
      console.time(`Migration ${key} took: `);
      newMigrations = true;

      try {
        await migration();
        await acknowledgeMigration(key, "success");
      } catch (error) {
        console.error(`Migration ${key} failed: `, error);
        await acknowledgeMigration(key, "failed");
      }

      console.timeEnd(`Migration ${key} took: `);
    }
  }

  if (!newMigrations) {
    console.log("No new migrations");
  }
}

async function acknowledgeMigration(name: string, status: "success" | "failed") {
  const sql = getTimescaleRepo().db();
  await sql`insert into migrations (name, status, timestamp) values (${name}, ${status}, ${new Date()})`;
}

async function ensureMigrationsTable() {
  const sql = getTimescaleRepo().db();
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
        name TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL
    );
  `;
}

async function getMigrations() {
  const sql = getTimescaleRepo().db();
  const result = await sql`select * from migrations`;
  return result as unknown as Migration[];
}
