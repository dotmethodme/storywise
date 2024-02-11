import type { StorywiseApp } from "@/types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Request = unknown;
type Response = Promise<StorywiseApp[]>;

export default eventHandler<Request, Response>(async (event) => {
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
