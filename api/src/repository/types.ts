import { Country, HitsPerPage, Referrer, SessionItem, Stats } from "@shared/types";
import { WebEvent } from "../types/models";

export interface IDataRepo {
  createEvent(event: WebEvent): Promise<void>;
  getSessionsPerDay(numberOfDays?: number): Promise<SessionItem[]>;
  getHitsPerPage(numberOfDays?: number): Promise<HitsPerPage[]>;
  getUniqueSessionsPerPage(numberOfDays?: number): Promise<HitsPerPage[]>;
  getTopReferrers(numberOfDays?: number): Promise<Referrer[]>;
  getUniqueSessionsByCountry(numberOfDays?: number): Promise<Country[]>;
  getStats(numberOfDays?: number): Promise<Stats>;
  hasAnyEvents(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
