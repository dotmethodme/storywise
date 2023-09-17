import {
  CountByCountry,
  CountByKeyValue,
  CountByReferrer,
  CountHitsPerPage,
  SessionItem,
  Stats,
  UserAgentQueryKeys,
} from "@shared/types";
import { WebEvent } from "../types/models";

export interface IDataRepo {
  createEvent(event: WebEvent): Promise<void>;
  getSessionsPerDay(numberOfDays?: number): Promise<SessionItem[]>;
  getHitsPerPage(numberOfDays?: number): Promise<CountHitsPerPage[]>;
  getUniqueSessionsPerPage(numberOfDays?: number): Promise<CountHitsPerPage[]>;
  getTopReferrers(numberOfDays?: number): Promise<CountByReferrer[]>;
  getUniqueSessionsByCountry(numberOfDays?: number): Promise<CountByCountry[]>;
  getStats(numberOfDays?: number): Promise<Stats>;
  getSessionCountByUserAgent(key: UserAgentQueryKeys, numberOfDays?: number): Promise<CountByKeyValue[]>;
  hasAnyEvents(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
