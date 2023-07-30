import { cols, db } from "@/server/database";
import { StorywiseApp, StorywiseAppCreate } from "@/types/types";
import { hash } from "bcrypt";

export default defineEventHandler<StorywiseApp>(async (event) => {
  const body = await readBody<StorywiseAppCreate>(event);

  if (!body.name) {
    throw createError({ status: 400, statusMessage: "Name is required" });
  }

  const existing = await db().collection<StorywiseApp>(cols.apps).findOne({ name: body.name });
  if (existing) {
    throw createError({
      status: 400,
      statusMessage: "Unfortunately, the app name is already taken. Please try another",
    });
  }

  const hashedPassword = await hash(body.password, 10);

  const insert = await db()
    .collection<StorywiseApp>(cols.apps)
    .insertOne({
      ...body,
      name: body.name,
      username: body.username,
      hashedPassword,
      ownerProfileId: event.context.profile._id,
      createdAt: new Date().toISOString(),
    });

  const item = await db().collection<StorywiseApp>(cols.apps).findOne({ _id: insert.insertedId });

  return item!;
});
