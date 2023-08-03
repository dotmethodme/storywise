import { MONGODB_URI, POSTGRES_URI, LIBSQL_URL } from "./dbConfig";
import { MongoRepo } from "./mongo";
import { PostgresRepo } from "./postgres";
import { LibsqlRepo } from "./libsql";
import { IDataRepo } from "./types";

let dataRepo: IDataRepo;

export function getDataRepo() {
  if (dataRepo) {
    return dataRepo;
  }

  if (!!MONGODB_URI) {
    dataRepo = new MongoRepo();
  } else if (!!POSTGRES_URI) {
    dataRepo = new PostgresRepo();
  } else if (!!LIBSQL_URL) {
    dataRepo = new LibsqlRepo();
  }

  return dataRepo;
}

export function getMongoRepo(): MongoRepo {
  if (!!MONGODB_URI) {
    if (dataRepo) {
      return dataRepo as MongoRepo;
    }

    dataRepo = new MongoRepo();
    return dataRepo as MongoRepo;
  }

  throw new Error("MongoRepo not initialized. MONGODB_URI is not set");
}

export function getLibsqlRepo(): LibsqlRepo {
  if (!!LIBSQL_URL) {
    if (dataRepo) {
      return dataRepo as LibsqlRepo;
    }

    dataRepo = new LibsqlRepo();
    return dataRepo as LibsqlRepo;
  }

  throw new Error("LibsqlRepo not initialized. LIBSQL_URL is not set");
}
