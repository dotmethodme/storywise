type Links = {
  links: {
    related: string;
    self: string;
  };
};

type LinkSelf = {
  self: string;
};

export type Subscription = {
  type: string;
  id: string;
  attributes: {
    store_id: number;
    customer_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_name: string;
    user_name: string;
    user_email: string;
    status: string;
    status_formatted: string;
    card_brand: string;
    card_last_four: string;
    pause: any;
    cancelled: boolean;
    trial_ends_at: any;
    billing_anchor: number;
    first_subscription_item: {
      id: number;
      subscription_id: number;
      price_id: number;
      quantity: number;
      is_usage_based: boolean;
      created_at: string;
      updated_at: string;
    };
    urls: {
      update_payment_method: string;
    };
    renews_at: string;
    ends_at: string;
    created_at: string;
    updated_at: string;
    test_mode: boolean;
  };
  relationships: {
    store: Links;
    customer: Links;
    order: Links;
    "order-item": Links;
    product: Links;
    variant: Links;
    "subscription-items": Links;
    "subscription-invoices": Links;
  };
  links: LinkSelf;
};

export type Invoice = {
  type: string;
  id: string;
  attributes: {
    store_id: number;
    subscription_id: number;
    customer_id: number;
    user_name: string;
    user_email: string;
    billing_reason: string;
    card_brand: string;
    card_last_four: string;
    currency: string;
    currency_rate: string;
    status: string;
    status_formatted: string;
    refunded: boolean;
    refunded_at: any;
    subtotal: number;
    discount_total: number;
    tax: number;
    total: number;
    subtotal_usd: number;
    discount_total_usd: number;
    tax_usd: number;
    total_usd: number;
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
    store: Links;
    subscription: Links;
    customer: Links;
  };
  links: LinkSelf;
};
