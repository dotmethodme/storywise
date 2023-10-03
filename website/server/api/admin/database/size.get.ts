import { getServerSession, getToken } from "#auth";
import { PrismaClient } from "@prisma/client";
import { DatabaseSize } from "~/types/types";

const config = useRuntimeConfig();
const prisma = new PrismaClient();

type Response = Promise<DatabaseSize>;

export default defineEventHandler<never, Response>(async (event) => {
  const token = await getToken({ event, secret: config.NEXTAUTH_SECRET });

  const profile = await prisma.profile.findUnique({
    where: { externalId: token?.sub },
    select: {
      organization: {
        select: { apps: true },
      },
    },
  });

  const apps = profile?.organization.apps || [];
  const firstApp = apps[0];

  if (!firstApp) {
    throw createError({ statusCode: 404, statusMessage: "No apps found" });
  }

  const size = await prisma.$queryRaw<DatabaseSize[]>`
        SELECT
            pg_database_size(${firstApp.name})::text as "sizeBytes",
            pg_size_pretty(pg_database_size(${firstApp.name})) as "sizePretty"
    `;

  return {
    sizeBytes: size[0].sizeBytes,
    sizePretty: size[0].sizePretty,
  };
});
