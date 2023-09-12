import { StorywiseApp } from "@/types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Request = unknown;
type Response = Promise<StorywiseApp>;

export default defineEventHandler<Request, Response>(async (event) => {
  const { id } = getQuery(event);

  if (!id || typeof id != "string") throw createError({ statusCode: 400, statusMessage: "Id is required" });

  const item = await prisma.app.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      organizationId: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  return item;
});
