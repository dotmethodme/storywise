import { getServerSession, getToken } from "#auth";
import { PrismaClient } from "@prisma/client";
import { UserRespose } from "../../../types/types";

const config = useRuntimeConfig();
const prisma = new PrismaClient();

type Request = unknown;
type Response = Promise<UserRespose>;

export default defineEventHandler<Request, Response>(async (event) => {
  const session = await getServerSession(event);

  const token = await getToken({ event, secret: config.NEXTAUTH_SECRET });

  if (!session) {
    console.log("no session error");
    throw createError({ statusCode: 500, statusMessage: "Session is missing" });
  }

  const email = session?.user?.email;
  const sub = token?.sub;
  const name = session?.user?.name;

  if (!email || !sub || !name) {
    throw createError({ statusCode: 500, statusMessage: "email, sub or name are missing" });
  }

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

  const result = {
    session,
    token,
    profile,
  };
  return result;
});
