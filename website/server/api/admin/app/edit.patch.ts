import { StorywiseApp, StorywiseAppPatch } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

type Request = { body: StorywiseAppPatch };
type Response = Promise<StorywiseApp>;

export default defineEventHandler<Request, Response>(async (event) => {
  const body = await readBody(event);

  const item = await prisma.app.findUnique({ where: { id: body.id } });

  if (!item) throw createError({ statusCode: 404, statusMessage: "Not found" });

  const update: { username: string; hashedPassword?: string } = { username: body.username };

  if (body.password) {
    update.hashedPassword = await hash(body.password, 10);
  }

  const newItem = await prisma.app.update({
    where: { id: body.id },
    data: update,
    select: {
      id: true,
      name: true,
      organizationId: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  $fetch("http://storywise-syncer/refresh").catch(() => {});

  return newItem;
});
