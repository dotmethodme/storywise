import { SessionItem, HitsPerPage, Referrer, Country, Stats } from "@shared/types";
import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";

/**
 * TODO: Implement the PostgresRepo class
 * Happy to accept volunteer contributions for this one!
 */
export class PostgresRepo implements IDataRepo {
  createEvent(event: WebEvent): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getSessionsPerDay(numberOfDays?: number | undefined): Promise<SessionItem[]> {
    throw new Error("Method not implemented.");
  }
  getHitsPerPage(numberOfDays?: number | undefined): Promise<HitsPerPage[]> {
    throw new Error("Method not implemented.");
  }
  getUniqueSessionsPerPage(numberOfDays?: number | undefined): Promise<HitsPerPage[]> {
    throw new Error("Method not implemented.");
  }
  getTopReferrers(numberOfDays?: number | undefined): Promise<Referrer[]> {
    throw new Error("Method not implemented.");
  }
  getUniqueSessionsByCountry(numberOfDays?: number | undefined): Promise<Country[]> {
    throw new Error("Method not implemented.");
  }
  getStats(numberOfDays?: number | undefined): Promise<Stats[]> {
    throw new Error("Method not implemented.");
  }
  hasAnyEvents(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  connect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
