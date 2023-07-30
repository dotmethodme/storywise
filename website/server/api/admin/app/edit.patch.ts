import { cols, db } from "@/server/database";
import { StorywiseAppPatch, StorywiseAppWithId } from "@/types/types";
import { hash } from "bcrypt";
import { ObjectId } from "mongodb";

export default defineEventHandler<StorywiseAppWithId>(async (event) => {
  const body = await readBody<StorywiseAppPatch>(event);
  const _id = new ObjectId(body._id);

  const item = await db().collection<StorywiseAppWithId>(cols.apps).findOne({ _id });

  if (!item) throw createError({ status: 404, message: "Not found" });

  const update: { username: string; hashedPassword?: string } = { username: body.username };

  if (body.password) {
    update.hashedPassword = await hash(body.password, 10);
  }

  await db().collection(cols.apps).updateOne({ _id }, { $set: update });

  const newItem = await db()
    .collection<StorywiseAppWithId>(cols.apps)
    .findOne({ _id }, { projection: { hashedPassword: 0 } });
  return newItem!;
});
