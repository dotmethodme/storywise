import { getServerSession, getToken } from "#auth";
import { Profile, UserRespose } from "../../../types/types";
import { cols, db } from "../../database";

const config = useRuntimeConfig();

export default defineEventHandler<UserRespose>(async (event) => {
  const session = await getServerSession(event);

  const token = await getToken({ event, secret: config.NEXTAUTH_SECRET });

  if (!session) {
    console.log("no session error");
    throw createError({ statusCode: 500, statusMessage: "Session is missing" });
  }

  const email = session?.user?.email;
  const sub = token?.sub;

  if (!email || !sub) {
    throw createError({ statusCode: 500, statusMessage: "Email or sub are missing" });
  }

  let profile = await db().collection<Profile>(cols.profiles).findOne({ externalId: sub });

  if (!profile) {
    await db().collection(cols.profiles).insertOne({
      email,
      externalId: sub,
      onboarded: false,
      createdAt: new Date(),
    });

    profile = await db().collection<Profile>(cols.profiles).findOne({ externalId: sub });
  }

  if (!profile) {
    throw createError({ statusCode: 500, statusMessage: "Profile is missing" });
  }

  const result = {
    session,
    token,
    profile,
  };
  return result;
});
