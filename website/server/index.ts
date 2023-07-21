import { mongoClient } from "./database";

export default async () => {
  const env = process.env.NODE_ENV as typeof process.env.NODE_ENV | "ci";
  try {
    if (env === "ci") {
      await mongoClient.connect();
      console.log("DB connection established");
    }
  } catch (err) {
    console.error("DB connection failed: ", err);
  }
};
