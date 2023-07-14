export type SessionItem = {
  count: number;
  year: number;
  month: number;
  day: number;
};

export type HitsPerPage = {
  count: number;
  path: string;
};

export type Referrer = {
  count: number;
  referrer: string;
};

export type Country = {
  count: number;
  country: string;
};

export type Stats = {
  uniqueVisitors: number;
  totalPageviews: number;
  viewsPerVisitor: number;
};

export type SiteConfig = {
  hasEvents: boolean;
  allowedOrigin: string;
  apiBaseUrl: string;
};
