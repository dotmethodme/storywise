import { MongoClient } from "mongodb";

const config = useRuntimeConfig();

export const mongoClient = new MongoClient(config.MONGODB_URL);

export const cols = {
  waitlist: "waitlist",
  profiles: "profiles",
  apps: "apps",
};

export function db() {
  return mongoClient.db();
}
