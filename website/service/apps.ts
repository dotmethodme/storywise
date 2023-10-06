import { PrismaClient } from "@prisma/client";

export async function getAppById(db: PrismaClient, id: string, organizationId: string) {
  return await db.app.findFirst({
    where: { id, organizationId },
    select: {
      id: true,
      name: true,
      organizationId: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
