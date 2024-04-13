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

export interface GetCountSessionsByUserAgentOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByKeyValue[];
}

export interface GetHitsPerPageOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountHitsPerPage[];
}

export interface GetSessionsPerDayOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: SessionItem[];
}

export interface GetTopReferrersOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByReferrer[];
}

export interface GetUniqueSessionsByCountryOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountByCountry[];
}

export interface GetUniqueSessionsPerPageOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  items: CountHitsPerPage[];
}

export interface GreetingOutputBody {
  /**
   * A URL to the JSON Schema for this object.
   * @format uri
   */
  $schema?: string;
  /** Greeting message */
  message: string;
}

export interface SessionItem {
  count: string;
  day: string;
  month: string;
  year: string;
}

export type GetCountSessionsByUserAgentData = GetCountSessionsByUserAgentOutputBody;

export type GetHitsPerPageData = GetHitsPerPageOutputBody;

export type GetSessionsPerDayData = GetSessionsPerDayOutputBody;

export type GetTopReferrersData = GetTopReferrersOutputBody;

export type GetUniqueSessionsByCountryData = GetUniqueSessionsByCountryOutputBody;

export type GetUniqueSessionsPerPageData = GetUniqueSessionsPerPageOutputBody;

export type GetGreetingByNameData = GreetingOutputBody;
