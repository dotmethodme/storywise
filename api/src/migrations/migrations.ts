import { MONGODB_URI, POSTGRES_URI, SQLITE_URI } from "../repository/dbConfig";

export async function migrate() {
  if (!!MONGODB_URI) {
    await (await import("./mongo")).migrateMongo();
  } else if (!!POSTGRES_URI) {
    /**
     * TODO: Implement the PostgresRepo class
     * Happy to accept volunteer contributions for this one!
     */
  } else if (!!SQLITE_URI) {
    /**
     * TODO: Implement the PostgresRepo class
     * Happy to accept volunteer contributions for this one!
     */
  }
}
