import { mongoClient } from "./database";

export default async () => {
  try {
    if (process.env.NODE_ENV === "ci") {
      await mongoClient.connect();
      console.log("DB connection established");
    }
  } catch (err) {
    console.error("DB connection failed: ", err);
  }
};
