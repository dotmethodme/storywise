import type { Subscription } from "~/types/lemonsqueezy";

export type SubscriptionResponse = {
  jsonapi: {
    version: string;
  };
  links: {
    self: string;
  };
  data: Subscription;
};

export type SubscriptionListResponse = {
  jsonapi: {
    version: string;
  };
  links: {
    self: string;
  };
  data: Subscription[];
};
