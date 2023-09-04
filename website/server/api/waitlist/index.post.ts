import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const WaitlistSubmitRequest = z.object({
  email: z.string().email(),
});

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const { email } = WaitlistSubmitRequest.parse(body);

    const existingRecord = await prisma.waitlist.findUnique({ where: { email } });

    if (existingRecord) {
      return { success: true };
    }

    await prisma.waitlist.create({ data: { email } });

    return { success: true };
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: "unable to parse input data" });
  }
});
