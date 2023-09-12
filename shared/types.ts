export type SessionItem = {
  count: number;
  year: number;
  month: number;
  day: number;
};

export type CountHitsPerPage = {
  count: number;
  path: string;
};

export type CountByReferrer = {
  count: number;
  referrer: string;
};

export type CountByCountry = {
  count: number;
  country: string;
};

export type CountByDevice = {
  count: number;
  device: string;
};

export type CountByOs = {
  count: number;
  os: string;
};

export type CountByBrowser = {
  count: number;
  browser: string;
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
