import {
  CountByBrowser,
  CountByDevice,
  CountByOs,
  CountByCountry,
  CountHitsPerPage,
  CountByReferrer,
  SessionItem,
  Stats,
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
  getUniqueSessionsByDevice(numberOfDays?: number): Promise<CountByDevice[]>;
  getUniqueSessionsByOs(numberOfDays?: number): Promise<CountByOs[]>;
  getUniqueSessionsByBrowser(numberOfDays?: number): Promise<CountByBrowser[]>;
  hasAnyEvents(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
