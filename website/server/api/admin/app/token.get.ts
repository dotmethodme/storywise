import jwt from "jsonwebtoken";
import type { StorywiseApp } from "@/types/types";
import { PrismaClient } from "@prisma/client";
import { getAppById } from "~/service/apps";

const prisma = new PrismaClient();
const config = useRuntimeConfig();

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

  return {
    token: issueJwt(app.name),
  };
});

export function issueJwt(appName: string) {
  const privateKey = config.JWT_PRIVATE_KEY;

  if (privateKey === undefined) {
    throw new Error("Backend does not support JWTs");
  }

  const body = {
    allowed: true,
    appName,
  };

  const token = jwt.sign(body, privateKey, { algorithm: "RS256", expiresIn: "12h" });

  return token;
}
