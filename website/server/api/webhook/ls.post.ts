import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const config = useRuntimeConfig();
const prisma = new PrismaClient();

type Request = { body: WebhookPayload<any> };
type Response = Promise<{ success: boolean }>;

export default defineEventHandler<Request, Response>(async (event) => {
  const signingSecret = config.LEMONSQUEEZY_WEBHOOK_SECRET;
  const expectedSignatureHeader = event.headers.get("x-signature");

  const bodyRaw = await readRawBody(event);
  const body = await readBody(event);

  if (!bodyRaw || !body || !expectedSignatureHeader) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  }

  const hmac = crypto.createHmac("sha256", signingSecret);
  const digest = Buffer.from(hmac.update(bodyRaw).digest("hex"), "utf8");
  const expectedSignature = Buffer.from(expectedSignatureHeader, "utf8");

  if (!crypto.timingSafeEqual(digest, expectedSignature)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const eventName = body.meta.event_name;
  const customData = body.meta.custom_data;

  return { success: true };
});

type SubscriptionEventNames =
  | "subscription_created"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_updated"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused";

type SubscriptionInvoiceEventNames =
  | "subscription_payment_success"
  | "subscription_payment_failed"
  | "subscription_payment_recovered";

type OrderEventNames = "order_created" | "order_refunded";

type LicenseKeyEventNames = "license_key_created";

export type WebhookPayload<CustomData = any> = {
  meta: {
    event_name:
      | SubscriptionEventNames
      | SubscriptionInvoiceEventNames
      | OrderEventNames
      | LicenseKeyEventNames;
    custom_data?: CustomData;
  };
  data: Subscription | SubscriptionInvoice | Order | LicenseKey;
};

// augmented type to make TypeScript discriminated unions work: https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions
export type DiscriminatedWebhookPayload<CustomData = any> =
  | {
      event_name: SubscriptionEventNames;
      meta: {
        event_name: SubscriptionEventNames;
        custom_data: CustomData;
      };
      data: Subscription;
    }
  | {
      event_name: SubscriptionInvoiceEventNames;
      meta: {
        event_name: SubscriptionInvoiceEventNames;
        custom_data: CustomData;
      };
      data: SubscriptionInvoice;
    }
  | {
      event_name: OrderEventNames;
      meta: { event_name: OrderEventNames; custom_data: CustomData };
      data: Order;
    }
  | {
      event_name: LicenseKeyEventNames;
      meta: { event_name: LicenseKeyEventNames; custom_data: CustomData };
      data: LicenseKey;
    };

export type EventName = WebhookPayload["meta"]["event_name"];

export type SubscriptionInvoice = {
  type: "subscription-invoices";
  id: string;
  attributes: {
    store_id: number;
    subscription_id: number;
    billing_reason: string;
    card_brand: string;
    card_last_four: string;
    currency: string;
    currency_rate: string;
    subtotal: number;
    discount_total: number;
    tax: number;
    total: number;
    subtotal_usd: number;
    discount_total_usd: number;
    tax_usd: number;
    total_usd: number;
    status: string;
    status_formatted: string;
    refunded: number;
    refunded_at: any;
    subtotal_formatted: string;
    discount_total_formatted: string;
    tax_formatted: string;
    total_formatted: string;
    urls: {
      invoice_url: string;
    };
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
  relationships: {
    store: {
      links: {
        related: string;
        self: string;
      };
    };
    subscription: {
      links: {
        related: string;
        self: string;
      };
    };
  };
  links: {
    self: string;
  };
};

export type Subscription = {
  type: "subscriptions";
  id: string;
  attributes: {
    store_id: number;
    order_id: number;
    customer_id: number;
    order_item_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    user_name: string;
    user_email: string;
    status: SubscriptionStatus;
    status_formatted: string;
    pause: any | null;
    cancelled: boolean;
    trial_ends_at: string | null;
    billing_anchor: number;
    urls: {
      update_payment_method: string;
    };
    renews_at: string;
    /**
     * If the subscription has as status of cancelled or expired, this will be an ISO-8601 formatted date-time string indicating when the subscription expires (or expired). For all other status values, this will be null.
     */
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
};

export type Order = {
  type: "orders";
  id: string;
  attributes: {
    store_id: number;
    identifier: string;
    order_number: number;
    user_name: string;
    user_email: string;
    currency: string;
    currency_rate: string;
    subtotal: number;
    discount_total: number;
    tax: number;
    total: number;
    subtotal_usd: number;
    discount_total_usd: number;
    tax_usd: number;
    total_usd: number;
    tax_name: string;
    tax_rate: string;
    status: string;
    status_formatted: string;
    refunded: number;
    refunded_at: any;
    subtotal_formatted: string;
    discount_total_formatted: string;
    tax_formatted: string;
    total_formatted: string;
    first_order_item: {
      id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      product_name: string;
      variant_name: string;
      price: number;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
    };
    created_at: string;
    updated_at: string;
  };
};

export type LicenseKey = {
  type: "license-keys";
  id: string;
  attributes: {
    store_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    user_name: string;
    user_email: string;
    key: string;
    key_short: string;
    activation_limit: number;
    instances_count: number;
    disabled: number;
    status: string;
    status_formatted: string;
    expires_at: any;
    created_at: string;
    updated_at: string;
  };
};

type SubscriptionStatus = "on_trial" | "active" | "paused" | "past_due" | "unpaid" | "cancelled" | "expired";
