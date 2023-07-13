import { mongoClient } from "./database";

export default async () => {
  try {
    await mongoClient.connect();
    console.log("DB connection established");
  } catch (err) {
    console.error("DB connection failed: ", err);
  }
};
