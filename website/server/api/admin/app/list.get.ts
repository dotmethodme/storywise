import { StorywiseApp } from "@/types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler<StorywiseApp[]>(async (event) => {
  const list = await prisma.app.findMany({
    where: { organizationId: event.context.profile.organizationId },
    select: {
      id: true,
      name: true,
      organizationId: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return list;
});
