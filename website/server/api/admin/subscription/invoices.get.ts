import type { EventHandlerRequest } from "h3";
import { getInvoices } from "~/server/services/LemonSqueezy";
import type { Invoice } from "~/types/lemonsqueezy";

type Response = Promise<Invoice[]>;

export default defineEventHandler<EventHandlerRequest, Response>(async (event) => {
  const subId = event.context.profile.organization.subscriptionId;
  if (!subId) throw createError({ statusCode: 400, statusMessage: "Subscription id is required" });

  const invoices = await getInvoices(subId);
  if (!invoices) throw createError({ statusCode: 400, statusMessage: "no invoices available" });

  return invoices;
});
