import type { EventHandlerRequest } from "h3";
import { deleteSubscription } from "~/server/services/LemonSqueezy";

type Response = Promise<{ success: boolean }>;

export default defineEventHandler<EventHandlerRequest, Response>(async (event) => {
  const subId = event.context.profile.organization.subscriptionId;
  if (!subId) throw createError({ statusCode: 400, statusMessage: "Subscription id is required" });

  await deleteSubscription(subId);

  return { success: true };
});
