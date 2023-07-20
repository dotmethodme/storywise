import { cols, db, mongoClient } from "../database";
import { Migration } from "../types/migrations";

export async function migrate() {
  console.log("Trying to run database migrations:");

  let newMigrations = false;

  const appliedMigrations = await db().collection(cols.migrations).find<Migration>({}).sort({ name: 1 }).toArray();

  const migrations = await import("./mongodb");

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
  await db().collection<Migration>(cols.migrations).insertOne({
    name,
    status,
    timestamp: new Date(),
  });
}
