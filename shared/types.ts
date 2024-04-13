export type CountHitsPerPage = {
  count: number;
  path: string;
};

export type CountByCountry = {
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

export type HasEvents = {
  hasEvents: boolean;
};

export type UserAgentQueryKeys = "client_type" | "client_name" | "device_type" | "device_brand" | "os_name";

export type UtmTagKey = "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content";

export type DataIo = {
  id: string;
  type: string;
  status: string;
  file_path?: string;
  created_at: Date;
  updated_at: Date;
  data: any;
};
