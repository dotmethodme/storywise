import { cols, db } from "@/server/database";
import { StorywiseAppPatch, StorywiseAppWithId } from "@/types/types";
import { hash } from "bcrypt";

export default defineEventHandler<StorywiseAppWithId>(async (event) => {
  const name = event.context.params?.name;
  if (!name) throw createError({ status: 404, message: "Not found" });

  const item = await db().collection<StorywiseAppWithId>(cols.apps).findOne({ name });
  if (!item) throw createError({ status: 404, message: "Not found" });

  const body = await readBody<StorywiseAppPatch>(event);

  const update: { username: string; hashedPassword?: string } = { username: body.username };

  if (body.password) {
    update.hashedPassword = await hash(body.password, 10);
  }

  await db().collection(cols.apps).updateOne({ name }, { $set: update });

  const newItem = await db().collection<StorywiseAppWithId>(cols.apps).findOne({ name });
  return newItem!;
});
