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

import {
  ErrorModel,
  GetAppsData,
  GetConfigData,
  GetCountSessionsByUserAgentData,
  GetCountSessionsByUtmData,
  GetHasEventsData,
  GetHitsPerPageData,
  GetSessionsPerDayData,
  GetStatsData,
  GetTopReferrersData,
  GetUniqueSessionsByCountryData,
  GetUniqueSessionsPerPageData,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Admin<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name GetApps
   * @summary Get apps
   * @request GET:/admin/api/apps
   */
  getApps = (params: RequestParams = {}) =>
    this.request<GetAppsData, ErrorModel>({
      path: `/admin/api/apps`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @name GetConfig
   * @summary Get config
   * @request GET:/admin/api/config
   */
  getConfig = (params: RequestParams = {}) =>
    this.request<GetConfigData, ErrorModel>({
      path: `/admin/api/config`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @name GetCountSessionsByUserAgent
   * @summary Get count of sessions by user agent
   * @request GET:/admin/api/count_sessions_by_user_agent
   */
  getCountSessionsByUserAgent = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Key
       * @default "user_agent"
       */
      key?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetCountSessionsByUserAgentData, ErrorModel>({
      path: `/admin/api/count_sessions_by_user_agent`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetCountSessionsByUtm
   * @summary Get count of sessions by utm
   * @request GET:/admin/api/count_sessions_by_utm
   */
  getCountSessionsByUtm = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Key
       * @default "user_agent"
       */
      key?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetCountSessionsByUtmData, ErrorModel>({
      path: `/admin/api/count_sessions_by_utm`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetHasEvents
   * @summary Get has events
   * @request GET:/admin/api/has-events
   */
  getHasEvents = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetHasEventsData, ErrorModel>({
      path: `/admin/api/has-events`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetHitsPerPage
   * @summary Get hits per page
   * @request GET:/admin/api/hits_per_page
   */
  getHitsPerPage = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetHitsPerPageData, ErrorModel>({
      path: `/admin/api/hits_per_page`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetSessionsPerDay
   * @summary Get sessions per day
   * @request GET:/admin/api/sessions_per_day
   */
  getSessionsPerDay = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetSessionsPerDayData, ErrorModel>({
      path: `/admin/api/sessions_per_day`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetStats
   * @summary Get stats
   * @request GET:/admin/api/stats
   */
  getStats = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetStatsData, ErrorModel>({
      path: `/admin/api/stats`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetTopReferrers
   * @summary Get top referrers
   * @request GET:/admin/api/top_referrers
   */
  getTopReferrers = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetTopReferrersData, ErrorModel>({
      path: `/admin/api/top_referrers`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetUniqueSessionsByCountry
   * @summary Get unique sessions by country
   * @request GET:/admin/api/unique_sessions_by_country
   */
  getUniqueSessionsByCountry = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetUniqueSessionsByCountryData, ErrorModel>({
      path: `/admin/api/unique_sessions_by_country`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @name GetUniqueSessionsPerPage
   * @summary Get unique sessions per page
   * @request GET:/admin/api/unique_sessions_per_page
   */
  getUniqueSessionsPerPage = (
    query?: {
      /**
       * App ID
       * @default "default"
       */
      app_id?: string;
      /**
       * Days
       * @format int64
       * @default 30
       */
      days?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<GetUniqueSessionsPerPageData, ErrorModel>({
      path: `/admin/api/unique_sessions_per_page`,
      method: "GET",
      query: query,
      ...params,
    });
}
