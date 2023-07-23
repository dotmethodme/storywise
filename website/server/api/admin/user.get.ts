import { getServerSession, getToken } from "#auth";
import { cols, db, mongoClient } from "../../database";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const token = await getToken({ event, secret: config.NEXTAUTH_SECRET });

  const email = session?.user?.email;
  const sub = token?.sub;

  if (!email || !sub) return false;

  let user = await db().collection(cols.users).findOne({ externalId: sub });

  if (!user) {
    await db().collection(cols.users).insertOne({
      email,
      externalId: sub,
      onboarded: false,
      createdAt: new Date(),
    });

    user = await db().collection(cols.users).findOne({ externalId: sub });
  }

  if (!session) {
    return { status: "unauthenticated!" };
  }

  return { session, token, user };
});
