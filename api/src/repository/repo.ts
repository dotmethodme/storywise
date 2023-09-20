import { MongoRepo } from "./mongo";
import { PostgresRepo } from "./postgres";
import { LibsqlRepo } from "./libsql";
import { IDataRepo } from "./types";

let dataRepo: IDataRepo;

export function getDataRepo() {
  if (dataRepo) {
    return dataRepo;
  }

  if (!!process.env.MONGODB_URI) {
    console.log("Using MongoDb");
    dataRepo = new MongoRepo();
  } else if (!!process.env.POSTGRES_URL) {
    console.log("Using Postgres");
    dataRepo = new PostgresRepo();
  } else if (!!process.env.LIBSQL_URL) {
    console.log("Using Libsql");
    dataRepo = new LibsqlRepo();
  } else {
    throw new Error(
      "No database configured. You need to set either MONGODB_URI, POSTGRES_URL or LIBSQL_URL as environment variable."
    );
  }
  return dataRepo;
}

export function getMongoRepo(): MongoRepo {
  if (!!process.env.MONGODB_URI) {
    if (dataRepo) {
      return dataRepo as MongoRepo;
    }

    dataRepo = new MongoRepo();
    return dataRepo as MongoRepo;
  }

  throw new Error("MongoRepo not initialized. MONGODB_URI is not set");
}

export function getLibsqlRepo(): LibsqlRepo {
  if (!!process.env.LIBSQL_URL) {
    if (dataRepo) {
      return dataRepo as LibsqlRepo;
    }

    dataRepo = new LibsqlRepo();
    return dataRepo as LibsqlRepo;
  }

  throw new Error("LibsqlRepo not initialized. LIBSQL_URL is not set");
}

export function getPostgresRepo(): PostgresRepo {
  if (!!process.env.POSTGRES_URL) {
    if (dataRepo) {
      return dataRepo as PostgresRepo;
    }

    dataRepo = new PostgresRepo();
    return dataRepo as PostgresRepo;
  }

  throw new Error("PostgresRepo not initialized. POSTGRES_URL is not set");
}

export function clearRepo() {
  dataRepo = undefined as any;
}
