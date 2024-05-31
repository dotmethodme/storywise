import { App } from "@shared/app";
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
import fs from "fs/promises";
import postgres from "postgres";
import ShortUniqueId from "short-unique-id";
import { file } from "tmp-promise";
import { v4 } from "uuid";
import { WebEvent } from "../types/models";
import { getDaysAgoString } from "../utils/date";
import { IDataRepo } from "./types";

export class PostgresRepo implements IDataRepo {
  public sql: postgres.Sql;

  private uid: ShortUniqueId;

  constructor(dbUrl = process.env.POSTGRES_URL) {
    this.uid = new ShortUniqueId({ length: 7 });

    if (!dbUrl) {
      throw new Error("POSTGRES_URL is not set");
    }

    const url = dbUrl;
    let options: postgres.Options<{}> = {
      prepare: false,
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

  getSessionCountByUserAgent(appId: string, key: UserAgentQueryKeys, numberOfDays = 30) {
    return this.sql<CountByKeyValue[]>`
      SELECT ${key} as key, ${this.sql(key)} as value, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)}
      AND app_id = ${appId}
      GROUP BY ${this.sql(key)}
      ORDER BY count DESC, value ASC
    `;
  }

  getSessionCountByUtmTag(appId: string, key: UtmTagKey, numberOfDays = 30) {
    return this.sql<CountByKeyValue[]>`
      SELECT ${key} as key, ${this.sql(key)} as value, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)}
      AND app_id = ${appId}
      GROUP BY ${this.sql(key)}
      ORDER BY count DESC, value ASC
    `;
  }

  async createEvent(event: WebEvent) {
    await this.sql`
      INSERT INTO events ${this.sql(event)}
    `;
  }

  getSessionsPerDay(appId: string, numberOfDays = 30) {
    return this.sql<SessionItem[]>`
      SELECT
        EXTRACT(YEAR FROM timestamp) as year,
        EXTRACT(MONTH FROM timestamp) as month,
        EXTRACT(DAY FROM timestamp) as day,
        COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)} 
      AND app_id = ${appId}
      GROUP BY year, month, day
      ORDER BY year, month, day;
    `;
  }

  getHitsPerPage(appId: string, numberOfDays = 30) {
    return this.sql<CountHitsPerPage[]>`
      SELECT path, COUNT(*) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)}
      AND app_id = ${appId}
      GROUP BY path
      ORDER BY count DESC, path ASC
    `;
  }

  getUniqueSessionsPerPage(appId: string, numberOfDays = 30) {
    return this.sql<CountHitsPerPage[]>`
      SELECT path, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)}
      AND app_id = ${appId}
      GROUP BY path
      ORDER BY count DESC, path ASC
    `;
  }

  getTopReferrers(appId: string, numberOfDays = 30) {
    return this.sql<CountByReferrer[]>`
      SELECT referrer, COUNT(*) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)}
      AND app_id = ${appId}
      GROUP BY referrer
      ORDER BY count DESC, referrer ASC
    `;
  }

  getUniqueSessionsByCountry(appId: string, numberOfDays = 30) {
    return this.sql<CountByCountry[]>`
      SELECT country, COUNT(DISTINCT session_id) as count
      FROM events
      WHERE timestamp >= ${getDaysAgoString(numberOfDays)}
      AND app_id = ${appId}
      GROUP BY country
      ORDER BY count DESC, country ASC
    `;
  }

  async getStats(appId: string, numberOfDays = 30) {
    const startDate = getDaysAgoString(numberOfDays);
    const result = await this.sql<Stats[]>`
      SELECT 
      (
        SELECT COUNT(DISTINCT session_id)
        FROM events
        WHERE timestamp >= ${startDate}
        AND app_id = ${appId}
      ) as "uniqueVisitors",
      (
        select COUNT(path) as totalPageviews FROM events
        WHERE timestamp >= ${startDate}
        AND app_id = ${appId}
      ) as "totalPageviews",
      (
        SELECT AVG(viewsPerVisitor) FROM (
          SELECT session_id, COUNT(*) as viewsPerVisitor
          FROM events
          WHERE timestamp >= ${startDate}
          AND app_id = ${appId}
          GROUP BY session_id
        ) as subq
      ) as "viewsPerVisitor"
    `;

    const response = result[0];
    response.viewsPerVisitor = Math.round(response.viewsPerVisitor * 100) / 100;
    return response;
  }

  async hasAnyEvents(appId?: string) {
    if (appId) {
      const result = await this.sql`select 1 from events where app_id = ${appId} limit 1`;
      return result.length > 0;
    }
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

  async startExport() {
    const newId = v4();
    const newFile = await file({ name: `${newId}.jsonl` });

    await this.sql`
      insert into data_io (id, type, status, file_path)
      values (${newId}, 'export', 'pending', ${newFile.path})
    `;

    this.performExport(newFile.path, newId);
  }

  private async performExport(filePath: string, id: string) {
    const limit = 5000;
    console.log("Starting export to", filePath);
    let cursor: Date | undefined = undefined;
    while (true) {
      console.log("Exporting from", cursor?.toISOString());
      const rows: WebEvent[] = await this.sql`
        select * from events
        ${cursor ? this.sql`where timestamp > ${cursor}` : this.sql``}
        order by timestamp asc
        limit ${limit}
      `;

      await fs.appendFile(filePath, rows.map((row) => JSON.stringify(row)).join("\n"));

      if (rows.length < limit) {
        break;
      } else {
        cursor = rows[rows.length - 1].timestamp;
      }
    }

    await this.sql`update data_io set status = 'complete', file_path = ${filePath} where id = ${id}`;

    console.log("Export complete");
  }

  async listDataIo() {
    const results: DataIo[] = await this.sql`select * from data_io`;
    return results;
  }

  async deleteDataIo(id: string) {
    await this.sql`delete from data_io where id = ${id}`;
  }

  public async listApps() {
    const result: App[] = await this.sql`select * from apps`;
    return result;
  }

  public async createApp(name: string) {
    const id = this.uid.randomUUID();
    await this.sql`insert into apps (id, name, urls) values (${id}, ${name}, ${""})`;
  }

  public async updateApp(id: string, name: string) {
    await this.sql`update apps set name = ${name} where id = ${id}`;
  }

  public async deleteApp(id: string) {
    await this.sql`delete from apps where id = ${id}`;
  }
}
