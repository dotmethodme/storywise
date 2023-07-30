import { cols, db } from "@/server/database";
import { StorywiseAppWithId } from "@/types/types";

export default defineEventHandler<StorywiseAppWithId>(async (event) => {
  const item = await db()
    .collection<StorywiseAppWithId>(cols.apps)
    .findOne({ name: event.context.params?.name }, { projection: { hashedPassword: 0 } });

  if (!item) {
    throw createError({ status: 404, message: "Not found" });
  }

  return item;
});
