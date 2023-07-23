import { MongoClient } from "mongodb";

const config = useRuntimeConfig();

export const mongoClient = new MongoClient(config.MONGODB_URL);

export const cols = {
  waitlist: "waitlist",
  users: "users",
};

export function db() {
  return mongoClient.db();
}
