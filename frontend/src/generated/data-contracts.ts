/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface App {
  created_at: string | null;
  id: string | null;
  name: string | null;
  updated_at: string | null;
  urls: string | null;
}

export interface Config {
  allowedOrigin: string;
  apiBaseUrl: string;
  hasEvents: boolean;
}

export interface CountByCountry {
  count: string | null;
  country: string | null;
}

export interface CountByKeyValue {
  count: string | null;
  key: string | null;
  value: string | null;
}

export interface CountByReferrer {
  count: string | null;
  referrer: string | null;
}

export interface CountHitsPerPage {
  count: string | null;
  path: string | null;
}

export interface CreateAppInputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  /** App name */
  name: string;
}

export interface DataIo {
  created_at: string | null;
  data: string | null;
  file_path: string | null;
  id: string | null;
  status: string | null;
  type: string | null;
  updated_at: string | null;
}

export interface ErrorDetail {
  /** Where the error occurred, e.g. 'body.items[3].tags' or 'path.thing-id' */
  location?: string;
  /** Error message text */
  message?: string;
  /** The value at the given location */
  value?: any;
}

export interface ErrorModel {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  /** A human-readable explanation specific to this occurrence of the problem. */
  detail?: string;
  /** Optional list of individual error details */
  errors?: ErrorDetail[];
  /**
   * A URI reference that identifies the specific occurrence of the problem.
   * @format uri
   */
  instance?: string;
  /**
   * HTTP status code
   * @format int64
   */
  status?: number;
  /** A short, human-readable summary of the problem type. This value should not change between occurrences of the error. */
  title?: string;
  /**
   * A URI reference to human-readable documentation for the error.
   * @format uri
   * @default "about:blank"
   */
  type?: string;
}

export interface GetAppsResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: App[];
}

export interface GetConfigResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  config: Config;
}

export interface GetCountSessionsByUserAgentResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByKeyValue[];
}

export interface GetCountSessionsByUtmResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByKeyValue[];
}

export interface GetDataIoResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: DataIo[];
}

export interface GetHasEventsResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  hasEvents: boolean;
}

export interface GetHitsPerPageResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountHitsPerPage[];
}

export interface GetSessionsPerDayResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: SessionItem[];
}

export interface GetStatsResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  item: Stats;
}

export interface GetTopReferrersResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByReferrer[];
}

export interface GetUniqueSessionsByCountryResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByCountry[];
}

export interface GetUniqueSessionsPerPageResponseBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountHitsPerPage[];
}

export interface SessionItem {
  count: string;
  day: string;
  month: string;
  year: string;
}

export interface Stats {
  totalPageviews: string | null;
  uniqueVisitors: string | null;
  viewsPerVisitor: string | null;
}

export interface UpdateAppInputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  /** App name */
  name: string;
}

export type GetAppsData = GetAppsResponseBody;

export type CreateAppData = any;

export type DeleteAppData = any;

export type UpdateAppData = any;

export type GetConfigData = GetConfigResponseBody;

export type GetCountSessionsByUserAgentData = GetCountSessionsByUserAgentResponseBody;

export type GetCountSessionsByUtmData = GetCountSessionsByUtmResponseBody;

export type GetDataIoData = GetDataIoResponseBody;

export type StartExportData = any;

export type DeleteDataIoData = any;

export type GetHasEventsData = GetHasEventsResponseBody;

export type GetHitsPerPageData = GetHitsPerPageResponseBody;

export type GetSessionsPerDayData = GetSessionsPerDayResponseBody;

export type GetStatsData = GetStatsResponseBody;

export type GetTopReferrersData = GetTopReferrersResponseBody;

export type GetUniqueSessionsByCountryData = GetUniqueSessionsByCountryResponseBody;

export type GetUniqueSessionsPerPageData = GetUniqueSessionsPerPageResponseBody;
