import { SessionItem, HitsPerPage, Referrer, Country, Stats } from "@shared/types";
import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";
import postgres from "postgres";
import { POSTGRES_URL } from "./dbConfig";
import { getDaysAgo } from "../utils/date";

export class PostgresRepo implements IDataRepo {
  public sql: postgres.Sql;

  constructor() {
    if (!POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not set");
    }

    let url = POSTGRES_URL;
    if(!!process.env.SCHEMA_NAME) {
      url += `&search_path=${process.env.SCHEMA_NAME}`;
    }

    this.sql = postgres(url, {
      ssl: {
        rejectUnauthorized: false,
      }
    });
  }

  createEvent(event: WebEvent): Promise<void> {
    throw new Error("Method not implemented.");
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
    return this.sql<HitsPerPage[]>`
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
    return this.sql<HitsPerPage[]>`
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
    return this.sql<Referrer[]>`
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
    return this.sql<Country[]>`
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
  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  db() {
    return this.sql;
  }
}
