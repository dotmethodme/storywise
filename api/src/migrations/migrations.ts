import { LIBSQL_URL, MONGODB_URI, POSTGRES_URL } from "../repository/dbConfig";

export async function migrate() {
  if (!!MONGODB_URI) {
    await (await import("./mongo")).migrateMongo();
  } else if (!!POSTGRES_URL) {
    await (await import("./postgres")).migratePostgres();
  } else if (!!LIBSQL_URL) {
    await (await import("./libsql")).migrateLibsql();
  } else {
    throw new Error("No other database type configured. Open to PRs if you want to add a new database!");
  }
}
