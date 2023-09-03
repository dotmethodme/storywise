import { StorywiseApp, StorywiseAppCreate } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export default defineEventHandler<StorywiseApp>(async (event) => {
  const body = await readBody<StorywiseAppCreate>(event);

  if (!body.name) {
    throw createError({ status: 400, statusMessage: "Name is required" });
  }

  const existing = await prisma.app.findUnique({ where: { name: body.name } });

  if (existing) {
    throw createError({
      status: 400,
      statusMessage: "Unfortunately, the app name is already taken. Please try another",
    });
  }

  const hashedPassword = await hash(body.password, 10);

  const item = await prisma.app.create({
    data: {
      name: body.name,
      username: body.username,
      hashedPassword,
      organizationId: event.context.profile.organizationId,
      createdAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      organizationId: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return item!;
});
