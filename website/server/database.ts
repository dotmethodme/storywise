import { Db, MongoClient } from "mongodb";

const config = useRuntimeConfig();

export let mongoClient: MongoClient;

export const cols = {
  waitlist: "waitlist",
  profiles: "profiles",
  apps: "apps",
};

export function db(): Db {
  if ((process.env.NODE_ENV as string) === "ci") {
    return {} as Db;
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(config.MONGODB_URL);
  }

  return mongoClient.db();
}
