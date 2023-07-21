import { WebEvent } from "../types/models";

export interface IDataRepo {
  createEvent(event: WebEvent): Promise<void>;
  getSessionsPerDay(numberOfDays?: number): Promise<Array<Record<string, unknown>>>;
  getHitsPerPage(numberOfDays?: number): Promise<Array<Record<string, unknown>>>;
  getUniqueSessionsPerPage(numberOfDays?: number): Promise<Array<Record<string, unknown>>>;
  getTopReferrers(numberOfDays?: number): Promise<any[]>;
  getUniqueSessionsByCountry(numberOfDays?: number): Promise<any[]>;
  getStats(numberOfDays?: number): Promise<any[]>;
  hasAnyEvents(): Promise<boolean>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
