import { getServerSession, getToken } from "#auth";
import { PrismaClient } from "@prisma/client";

const config = useRuntimeConfig();

const prisma = new PrismaClient();

export default eventHandler(async (event) => {
  if (event.path.startsWith("/api/admin")) {
    const session = await getServerSession(event);
    const token = await getToken({ event, secret: config.NEXTAUTH_SECRET });

    if (!session) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }

    const email = session?.user?.email;
    const sub = token?.sub;
    const name = session?.user?.name;

    if (!sub || !email || !name) {
      throw createError({ statusCode: 500, statusMessage: "email, sub or name are missing" });
    }

    // let profile = await db().collection<Profile>(cols.profiles).findOne({ externalId: sub });
    let profile = await prisma.profile.findUnique({
      where: { externalId: sub },
      include: { organization: true },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          email,
          externalId: sub,
          onboarded: false,
          createdAt: new Date(),
          organization: {
            create: {
              name: name,
            },
          },
        },
        include: { organization: true },
      });
    }

    if (!profile) {
      throw createError({
        statusCode: 500,
        statusMessage: "Fatal error: profile and organization is missing",
      });
    }

    event.context.profile = profile;
  }
});
