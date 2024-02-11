import { getSubscriptionByUserId } from "~/server/services/LemonSqueezy";
import type { EventHandlerRequest } from "h3";
import type { Subscription } from "~/types/lemonsqueezy";

type Response = Promise<Subscription>;

export default defineEventHandler<EventHandlerRequest, Response>(async (event) => {
  const subId = event.context.profile.organization.subscriptionId;
  if (!subId) throw createError({ statusCode: 400, statusMessage: "Subscription id is required" });

  const subscription = await getSubscriptionByUserId(subId);
  if (!subscription) throw createError({ statusCode: 400, statusMessage: "Subscription is required" });

  return subscription;
});
