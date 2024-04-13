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

import { ErrorModel, GetCountSessionsByUserAgentData, GetSessionsPerDayData } from "./data-contracts";
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
}
