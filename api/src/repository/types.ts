import {
  CountByCountry,
  CountByKeyValue,
  CountByReferrer,
  CountHitsPerPage,
  DataIo,
  SessionItem,
  Stats,
  UserAgentQueryKeys,
} from "@shared/types";
import { WebEvent } from "../types/models";

export interface IDataRepo {
  // Lifecycle
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  // Events
  hasAnyEvents(): Promise<boolean>;
  createEvent(event: WebEvent): Promise<void>;

  // Stats and counts
  getSessionsPerDay(numberOfDays?: number): Promise<SessionItem[]>;
  getHitsPerPage(numberOfDays?: number): Promise<CountHitsPerPage[]>;
  getUniqueSessionsPerPage(numberOfDays?: number): Promise<CountHitsPerPage[]>;
  getTopReferrers(numberOfDays?: number): Promise<CountByReferrer[]>;
  getUniqueSessionsByCountry(numberOfDays?: number): Promise<CountByCountry[]>;
  getStats(numberOfDays?: number): Promise<Stats>;
  getSessionCountByUserAgent(key: UserAgentQueryKeys, numberOfDays?: number): Promise<CountByKeyValue[]>;

  // Exports
  startExport(): Promise<void>;
  listDataIo(): Promise<DataIo[]>;
}
