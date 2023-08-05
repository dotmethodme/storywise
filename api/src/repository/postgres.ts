import { SessionItem, HitsPerPage, Referrer, Country, Stats } from "@shared/types";
import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";
import postgres from "postgres";
import { POSTGRES_URL } from "./dbConfig";

export class PostgresRepo implements IDataRepo {
  public sql: postgres.Sql<{}>;

  constructor() {
    if (!POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not set");
    }

    this.sql = postgres(POSTGRES_URL);
  }

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
  getStats(numberOfDays?: number | undefined): Promise<Stats> {
    throw new Error("Method not implemented.");
  }
  async hasAnyEvents() {
    const result = await this.sql`select 1 from events limit 1`;
    return result.length > 0;
  }
  async connect() {
    // noop
  }
  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  db() {
    return this.sql;
  }
}
