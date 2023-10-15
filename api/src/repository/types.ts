import {
  CountByCountry,
  CountByKeyValue,
  CountByReferrer,
  CountHitsPerPage,
  DataIo,
  SessionItem,
  Stats,
  UserAgentQueryKeys,
  UtmTagKey,
} from "@shared/types";
import { WebEvent } from "../types/models";
import { App } from "@shared/app";

export interface IDataRepo {
  // Lifecycle
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  // Events
  hasAnyEvents(appId?: string): Promise<boolean>;
  createEvent(event: WebEvent): Promise<void>;

  // Stats and counts
  getSessionsPerDay(appId: string, numberOfDays?: number): Promise<SessionItem[]>;
  getHitsPerPage(appId: string, numberOfDays?: number): Promise<CountHitsPerPage[]>;
  getUniqueSessionsPerPage(appId: string, numberOfDays?: number): Promise<CountHitsPerPage[]>;
  getTopReferrers(appId: string, numberOfDays?: number): Promise<CountByReferrer[]>;
  getUniqueSessionsByCountry(appId: string, numberOfDays?: number): Promise<CountByCountry[]>;
  getStats(appId: string, numberOfDays?: number): Promise<Stats>;
  getSessionCountByUserAgent(appId: string, key: UserAgentQueryKeys, numberOfDays?: number): Promise<CountByKeyValue[]>;
  getSessionCountByUtmTag(appId: string, key: UtmTagKey, numberOfDays?: number): Promise<CountByKeyValue[]>;

  // Exports
  startExport(): Promise<void>;
  listDataIo(): Promise<DataIo[]>;
  deleteDataIo(id: string): Promise<void>;

  // Apps
  listApps(): Promise<App[]>;
  createApp(name: string): Promise<void>;
  updateApp(id: string, name: string): Promise<void>;
  deleteApp(id: string): Promise<void>;
}
