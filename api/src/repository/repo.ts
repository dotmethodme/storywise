import { MongoRepo } from "./mongo";
import { PostgresRepo } from "./postgres";
import { SqliteRepo } from "./sqlite";
import { IDataRepo } from "./types";

const MONGODB_URI = process.env.MONGODB_URI;
const POSTGRES_URI = process.env.POSTGRES_URI;
const SQLITE_URI = process.env.SQLITE_URI;

let dataRepo: IDataRepo;

export function getDataRepo() {
  if (dataRepo) {
    return dataRepo;
  }

  if (!!MONGODB_URI) {
    dataRepo = new MongoRepo();
  } else if (!!POSTGRES_URI) {
    dataRepo = new PostgresRepo();
  } else if (!!SQLITE_URI) {
    dataRepo = new SqliteRepo();
  }

  return dataRepo;
}

export function getMongoRepo(): MongoRepo {
  console.log("getMongoRepo");
  if (!!MONGODB_URI) {
    if (dataRepo) {
      return dataRepo as MongoRepo;
    }

    dataRepo = new MongoRepo();
    return dataRepo as MongoRepo;
  }

  throw new Error("MongoRepo not initialized. MONGODB_URI is not set");
}
