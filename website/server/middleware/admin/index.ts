import { getServerSession, getToken } from "#auth";
import { cols, db } from "@/server/database";
import { Profile } from "@/types/types";

const config = useRuntimeConfig();

export default eventHandler(async (event) => {
  if (event.path.startsWith("/api/admin")) {
    const session = await getServerSession(event);
    const token = await getToken({ event, secret: config.NEXTAUTH_SECRET });

    if (!session) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

  const email = session?.user?.email;
  const sub = token?.sub;

    if (!sub) {
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

    event.context.profile = profile;
  }
});
