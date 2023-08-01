import { cols, db } from "@/server/database";
import { StorywiseAppWithId } from "@/types/types";
import { ObjectId } from "mongodb";

export default defineEventHandler<StorywiseAppWithId>(async (event) => {
  const { id } = getQuery(event);

  if (!id || typeof id != "string") throw createError({ status: 400, message: "Id is required" });

  const item = await db()
    .collection<StorywiseAppWithId>(cols.apps)
    .findOne({ _id: new ObjectId(id) }, { projection: { hashedPassword: 0 } });

  if (!item) {
    throw createError({ status: 404, message: "Not found" });
  }

  return item;
});
