import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";

export class PostgresRepo implements IDataRepo {
  connect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  createEvent(event: WebEvent): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getSessionsPerDay(numberOfDays?: number | undefined): Promise<Record<string, unknown>[]> {
    throw new Error("Method not implemented.");
  }
  getHitsPerPage(numberOfDays?: number | undefined): Promise<Record<string, unknown>[]> {
    throw new Error("Method not implemented.");
  }
  getUniqueSessionsPerPage(numberOfDays?: number | undefined): Promise<Record<string, unknown>[]> {
    throw new Error("Method not implemented.");
  }
  getTopReferrers(numberOfDays?: number | undefined): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  getUniqueSessionsByCountry(numberOfDays?: number | undefined): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  getStats(numberOfDays?: number | undefined): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  hasAnyEvents(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
