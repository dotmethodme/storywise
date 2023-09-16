import { Invoice } from "~/types/lemonsqueezy";

export type InvoiceListResponse = {
  meta: {
    page: {
      currentPage: number;
      from: number;
      lastPage: number;
      perPage: number;
      to: number;
      total: number;
    };
  };
  jsonapi: {
    version: string;
  };
  links: {
    first: string;
    last: string;
  };
  data: Invoice[];
};
