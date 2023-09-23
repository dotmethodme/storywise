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

export type CountByKeyValue = {
  count: number;
  key: string;
  value: string;
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

export type UserAgentQueryKeys = "client_type" | "client_name" | "device_type" | "device_brand" | "os_name";

export type DataIo = {
  id: string;
  type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  data: any;
};
