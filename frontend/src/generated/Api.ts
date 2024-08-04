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
  CreateEventData,
  CreateEventInputBody,
  EchoEventData,
  ErrorModel,
  HealthCheckData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name CreateEvent
   * @request POST:/api/event
   */
  createEvent = (data: CreateEventInputBody, params: RequestParams = {}) =>
    this.request<CreateEventData, ErrorModel>({
      path: `/api/event`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name EchoEvent
   * @request POST:/api/event/echo
   */
  echoEvent = (data: CreateEventInputBody, params: RequestParams = {}) =>
    this.request<EchoEventData, ErrorModel>({
      path: `/api/event/echo`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name HealthCheck
   * @summary Health check
   * @request GET:/api/health
   */
  healthCheck = (params: RequestParams = {}) =>
    this.request<HealthCheckData, ErrorModel>({
      path: `/api/health`,
      method: "GET",
      ...params,
    });
}
