import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

export const databaseName = process.env.DATABASE_NAME || "analytics";
export const cols = {
  events: "events",
};

export const mongoClient = new MongoClient(process.env.MONGODB_URI);

export async function connect() {
  await mongoClient.connect();
}

export async function disconnect() {
  await mongoClient.close();
}
