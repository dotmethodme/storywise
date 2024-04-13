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

import { ErrorModel, GetGreetingByNameData } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Greeting<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name GetGreetingByName
   * @summary Get greeting by name
   * @request GET:/greeting/{name}
   */
  getGreetingByName = (name: string, params: RequestParams = {}) =>
    this.request<GetGreetingByNameData, ErrorModel>({
      path: `/greeting/${name}`,
      method: "GET",
      ...params,
    });
}
