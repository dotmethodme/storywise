import {
  CountByBrowser,
  CountByCountry,
  CountByDevice,
  CountByOs,
  CountByReferrer,
  CountHitsPerPage,
  SessionItem,
  Stats,
} from "@shared/types";
import postgres from "postgres";
import { WebEvent } from "../types/models";
import { getDaysAgo } from "../utils/date";
import { IDataRepo } from "./types";

export class PostgresRepo implements IDataRepo {
  public sql: postgres.Sql;

  constructor() {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not set");
    }

    const url = process.env.POSTGRES_URL;
    let options: postgres.Options<{}> = {
      ssl: {
        rejectUnauthorized: false,
      },
    };

    if (url.includes("sslmode=disable")) {
      options.ssl = false;
    }

    if (process.env.DATABASE_NAME) {
      options.database = process.env.DATABASE_NAME;
    }

    this.sql = postgres(url, options);
  }

  getUniqueSessionsByDevice(numberOfDays = 30): Promise<CountByDevice[]> {
    return this.sql<CountByDevice[]>`
      SELECT device_type as device, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${getDaysAgo(numberOfDays).toISOString()}
      GROUP BY device_type
      ORDER BY count DESC, device ASC
    `;
  }

  getUniqueSessionsByOs(numberOfDays?: number | undefined): Promise<CountByOs[]> {
    throw new Error("Method not implemented.");
  }

  getUniqueSessionsByBrowser(numberOfDays?: number | undefined): Promise<CountByBrowser[]> {
    throw new Error("Method not implemented.");
  }

  async createEvent(event: WebEvent) {
    await this.sql`
      INSERT INTO events ${this.sql(event)}
    `;
  }

  getSessionsPerDay(numberOfDays = 30) {
    const startDate = getDaysAgo(numberOfDays || 30);
    const endDate = new Date();
    return this.sql<SessionItem[]>`
      SELECT
        EXTRACT(YEAR FROM timestamp) as year,
        EXTRACT(MONTH FROM timestamp) as month,
        EXTRACT(DAY FROM timestamp) as day,
        COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${startDate.toISOString()} 
      AND timestamp < ${endDate.toISOString()}
      GROUP BY year, month, day
      ORDER BY year, month, day;
    `;
  }

  getHitsPerPage(numberOfDays = 30) {
    const startDate = getDaysAgo(numberOfDays);
    const endDate = new Date();
    return this.sql<CountHitsPerPage[]>`
      SELECT path, COUNT(*) as count
      FROM events
      WHERE timestamp >= ${startDate.toISOString()} 
      AND timestamp < ${endDate.toISOString()}
      GROUP BY path
      ORDER BY count DESC, path ASC
    `;
  }

  getUniqueSessionsPerPage(numberOfDays = 30) {
    const startDate = getDaysAgo(numberOfDays);
    const endDate = new Date();
    return this.sql<CountHitsPerPage[]>`
      SELECT path, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${startDate.toISOString()}
      AND timestamp < ${endDate.toISOString()}
      GROUP BY path
      ORDER BY count DESC, path ASC
    `;
  }

  getTopReferrers(numberOfDays = 30) {
    const startDate = getDaysAgo(numberOfDays);
    const endDate = new Date();
    return this.sql<CountByReferrer[]>`
      SELECT referrer, COUNT(*) as count
      FROM events
      WHERE timestamp >= ${startDate.toISOString()}
      AND timestamp < ${endDate.toISOString()}
      GROUP BY referrer
      ORDER BY count DESC, referrer ASC
    `;
  }

  getUniqueSessionsByCountry(numberOfDays = 30) {
    const startDate = getDaysAgo(numberOfDays);
    const endDate = new Date();
    return this.sql<CountByCountry[]>`
      SELECT country, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${startDate.toISOString()}
      AND timestamp < ${endDate.toISOString()}
      GROUP BY country
      ORDER BY count DESC, country ASC
    `;
  }

  async getStats(numberOfDays = 30) {
    const startDate = getDaysAgo(numberOfDays);
    const endDate = new Date();
    const result = await this.sql<Stats[]>`
      SELECT 
      (
        SELECT COUNT(DISTINCT session_id)
        FROM events
        WHERE timestamp >= ${startDate.toISOString()} AND timestamp < ${endDate.toISOString()}
      ) as "uniqueVisitors",
      (
        select COUNT(path) as totalPageviews FROM events
        WHERE timestamp >= ${startDate.toISOString()} AND timestamp < ${endDate.toISOString()}
      ) as "totalPageviews",
      (
        SELECT AVG(viewsPerVisitor) FROM (
          SELECT session_id, COUNT(*) as viewsPerVisitor
          FROM events
          WHERE timestamp >= ${startDate.toISOString()} AND timestamp < ${endDate.toISOString()}
          GROUP BY session_id
        ) as subq
      ) as "viewsPerVisitor"
    `;

    const response = result[0];
    response.viewsPerVisitor = Math.round(response.viewsPerVisitor * 100) / 100;
    return response;
  }

  async hasAnyEvents() {
    const result = await this.sql`select 1 from events limit 1`;
    return result.length > 0;
  }

  async connect() {
    // noop
  }

  async disconnect() {
    await this.sql.end();
  }

  db() {
    return this.sql;
  }
}
