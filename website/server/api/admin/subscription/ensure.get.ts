import { PrismaClient } from "@prisma/client";
import type { EventHandlerRequest } from "h3";
import { getSubscriptionByEmail } from "~/server/services/LemonSqueezy";
import { Subscription } from "~/types/lemonsqueezy";

const prisma = new PrismaClient();

export default defineEventHandler<EventHandlerRequest, Promise<{ created: boolean }>>(async (event) => {
  const email = event.context.profile.email;

  if (event.context.profile.organization.subscriptionId) return { created: false };

  const subscriptions = await getSubscriptionByEmail(email);

  const activeSubscription = subscriptions.find((sub) => sub.attributes.status === "active");
  if (!activeSubscription) {
    throw createError({ statusCode: 400, statusMessage: "A subscription is required" });
  }

  const user = await prisma.profile.findUnique({
    where: { id: event.context.profile.id },
    select: { organization: true },
  });
  if (!user?.organization) return { created: false };
  await prisma.organization.update({
    where: { id: user.organization.id },
    data: { subscriptionId: activeSubscription.id },
  });
  if (!user?.organization) return { created: false };

  return { created: true };
});
