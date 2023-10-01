import { Client } from "@libsql/client";
import { getLibsqlRepo } from "../repository/repo";
import { Migration } from "../types/migrations";

export async function migrateLibsql() {
  console.log("Trying to run database migrations:");

  const db = getLibsqlRepo().db();

  await ensureMigrationsTable(db);

  let newMigrations = false;

  const appliedMigrations = await getMigrations(db);

  const migrations = await import("./libsql/index");

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
        await acknowledgeMigration(db, key, "success");
      } catch (error) {
        console.error(`Migration ${key} failed: `, error);
        await acknowledgeMigration(db, key, "failed");
      }

      console.timeEnd(`Migration ${key} took: `);
    }
  }

  if (!newMigrations) {
    console.log("No new migrations");
  }
}

async function acknowledgeMigration(db: Client, name: string, status: "success" | "failed") {
  await db.execute({
    sql: `insert into migrations (name, status, timestamp) values (?, ?, ?)`,
    args: [name, status, new Date()],
  });
}

async function ensureMigrationsTable(db: Client) {
  const collections = await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
        name TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL
    );
  `);
}

async function getMigrations(db: Client) {
  const result = await db.execute(`select * from migrations`);
  return result.rows as unknown as Migration[];
}
