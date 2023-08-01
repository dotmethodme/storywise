import { cols, db } from "@/server/database";
import { StorywiseAppWithId } from "@/types/types";

export default defineEventHandler<StorywiseAppWithId[]>(async (event) => {
  const list = await db()
    .collection<StorywiseAppWithId>(cols.apps)
    .find({ ownerProfileId: event.context.profile._id }, { projection: { hashedPassword: 0 } })
    .toArray();

  return list;
});
