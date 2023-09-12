export async function migrate() {
  if (!!process.env.MONGODB_URI) {
    await (await import("./mongo")).migrateMongo();
  } else if (!!process.env.POSTGRES_URL) {
    await (await import("./postgres")).migratePostgres();
  } else if (!!process.env.LIBSQL_URL) {
    await (await import("./libsql")).migrateLibsql();
  } else {
    throw new Error("No other database type configured. Open to PRs if you want to add a new database!");
  }
}
