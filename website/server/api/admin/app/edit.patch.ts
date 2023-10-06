import { StorywiseApp, StorywiseAppPatch } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { getAppById } from "~/service/apps";

const prisma = new PrismaClient();

type Request = { body: StorywiseAppPatch };
type Response = Promise<StorywiseApp>;

export default defineEventHandler<Request, Response>(async (event) => {
  const body = await readBody(event);
  const { organizationId } = event.context.profile;

  const app = await getAppById(prisma, body.id, organizationId);

  if (!app) throw createError({ statusCode: 404, statusMessage: "Not found" });
  if (app.organizationId !== event.context.profile.organizationId) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

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
