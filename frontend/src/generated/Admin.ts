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
  GetCountSessionsByUserAgentData,
  GetHitsPerPageData,
  GetSessionsPerDayData,
  GetTopReferrersData,
  GetUniqueSessionsByCountryData,
  GetUniqueSessionsPerPageData,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Admin<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
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
