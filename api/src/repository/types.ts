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
import { App } from "@shared/app";

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

  // Apps
  listApps(): Promise<App[]>;
  createApp(name: string): Promise<void>;
  updateApp(id: string, name: string): Promise<void>;
  deleteApp(id: string): Promise<void>;
}
