import { StorywiseApp } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { getAppById } from "~/service/apps";

const prisma = new PrismaClient();

type Request = unknown;
type Response = Promise<StorywiseApp>;

export default defineEventHandler<Request, Response>(async (event) => {
  const { id } = getQuery(event);
  const { organizationId } = event.context.profile;

  if (!id || typeof id != "string") throw createError({ statusCode: 400, statusMessage: "Id is required" });

  const app = await getAppById(prisma, id, organizationId);

  if (!app) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }

  return app;
});
