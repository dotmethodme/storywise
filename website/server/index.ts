import { mongoClient } from "./database";

type Type = "development" | "production" | "test" | "ci";

export default async () => {
  const env = process.env.NODE_ENV as Type;
  try {
    if (env === "ci") {
      await mongoClient.connect();
      console.log("DB connection established");
    }
  } catch (err) {
    console.error("DB connection failed: ", err);
  }
};
