import { getServerSession } from "#auth";
import { db, mongoClient } from "../../database";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  db().collection("events");

  if (!session) {
    return { status: "unauthenticated!" };
  }

  return { session };
});
