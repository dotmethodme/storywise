import { MongoRepo } from "./mongo";
import { PostgresRepo } from "./postgres";
import { LibsqlRepo } from "./libsql";
import { IDataRepo } from "./types";
import { TimescaleRepo } from "./timescale";

let dataRepo: IDataRepo;

export function getDataRepo() {
  if (dataRepo) return dataRepo;

  if (process.env.MONGODB_URI) {
    console.log("Using MongoDb");
    dataRepo = new MongoRepo();
  } else if (process.env.POSTGRES_URL) {
    console.log("Using Postgres");
    dataRepo = new PostgresRepo();
  } else if (process.env.LIBSQL_URL) {
    console.log("Using Libsql");
    dataRepo = new LibsqlRepo();
  } else if (process.env.TIMESCALEDB_URL) {
    console.log("Using TimescaleDB");
    dataRepo = new TimescaleRepo();
  } else {
    throw new Error(
      "No database configured. You need to set either MONGODB_URI, POSTGRES_URL or LIBSQL_URL as environment variable."
    );
  }
  return dataRepo;
}

export function getMongoRepo(): MongoRepo {
  if (!process.env.MONGODB_URI) throw new Error("MongoRepo not initialized. MONGODB_URI is not set");
  if (!dataRepo) dataRepo = new MongoRepo();
  return dataRepo as MongoRepo;
}

export function getLibsqlRepo(): LibsqlRepo {
  if (!process.env.LIBSQL_URL) throw new Error("LibsqlRepo not initialized. LIBSQL_URL is not set");
  if (!dataRepo) dataRepo = new LibsqlRepo();
  return dataRepo as LibsqlRepo;
}

export function getPostgresRepo(): PostgresRepo {
  if (!process.env.POSTGRES_URL) throw new Error("PostgresRepo not initialized. POSTGRES_URL is not set");
  if (!dataRepo) dataRepo = new PostgresRepo();
  return dataRepo as PostgresRepo;
}

export function getTimescaleRepo(): TimescaleRepo {
  if (!process.env.TIMESCALEDB_URL) throw new Error("TimescaleRepo not initialized. TIMESCALEDB_URL is not set");
  if (!dataRepo) dataRepo = new TimescaleRepo();
  return dataRepo as TimescaleRepo;
}

export function clearRepo() {
  dataRepo = undefined as any;
}
