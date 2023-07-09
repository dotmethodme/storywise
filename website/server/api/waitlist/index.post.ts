import { cols, mongoClient } from "../../database";

import { ZodError, z } from "zod";

const WaitlistSubmitRequest = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const { email } = WaitlistSubmitRequest.parse(body);

    const existingRecord = await mongoClient
      .db()
      .collection(cols.waitlist)
      .findOne({ email });

    if (existingRecord) {
      return { success: true };
    }

    await mongoClient
      .db()
      .collection(cols.waitlist)
      .insertOne({ email, createdAt: new Date() });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: "unable to parse input data",
    });
  }
});
