import type { Invoice, Subscription } from "~/types/lemonsqueezy";
import type { SubscriptionListResponse, SubscriptionResponse } from "./SubscriptionResponse";
import type { InvoiceListResponse } from "./InvoiceListResponse";

const config = useRuntimeConfig();

const headers = {
  Accept: "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json",
  Authorization: `Bearer ${config.LEMONSQUEEZY_API_KEY}`,
};

export async function getSubscriptionByUserId(subId: string): Promise<Subscription> {
  const url = `https://api.lemonsqueezy.com/v1/subscriptions/${subId}`;
  const result = await fetch(url, { method: "GET", headers });
  const response: SubscriptionResponse = await result.json();
  return response.data;
}

export async function getInvoices(subId: string): Promise<Invoice[]> {
  const url = `https://api.lemonsqueezy.com/v1/subscription-invoices?filter[subscription_id]=${subId}`;
  const result = await fetch(url, { method: "GET", headers });
  const response: InvoiceListResponse = await result.json();
  return response.data;
}

export async function deleteSubscription(subId: string): Promise<void> {
  const url = `https://api.lemonsqueezy.com/v1/subscriptions/${subId}`;
  await fetch(url, { method: "DELETE", headers });
}

export async function getSubscriptionByEmail(email: string): Promise<Subscription[]> {
  const url = `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${email}`;
  const result = await fetch(url, { method: "GET", headers });
  const response: SubscriptionListResponse = await result.json();
  return response.data;
}
