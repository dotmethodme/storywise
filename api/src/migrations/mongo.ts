import { Db } from "mongodb";
import { cols } from "../repository/mongo";
import { getMongoRepo } from "../repository/repo";
import { Migration } from "../types/migrations";

export async function migrateMongo() {
  console.log("Trying to run database migrations:");

  const db = getMongoRepo().db();

  let newMigrations = false;

  const appliedMigrations = await db.collection(cols.migrations).find<Migration>({}).sort({ name: 1 }).toArray();

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
        await acknowledgeMigration(db, key, "success");
      } catch (error) {
        await acknowledgeMigration(db, key, "failed");
      }

      console.timeEnd(`Migration ${key} took: `);
    }
  }

  if (!newMigrations) {
    console.log("No new migrations");
  }
}

async function acknowledgeMigration(db: Db, name: string, status: "success" | "failed") {
  await db.collection<Migration>(cols.migrations).insertOne({
    name,
    status,
    timestamp: new Date(),
  });
}
