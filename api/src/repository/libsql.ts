import { Client as LibsqlClient, createClient } from "@libsql/client";
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
import { webEventToSqlFormat } from "../utils/parsers";
import { IDataRepo } from "./types";
import { getDaysAgo } from "../utils/date";
import { v4 } from "uuid";
import { file } from "tmp-promise";
import fs from "fs/promises";
import { App } from "@shared/app";
import ShortUniqueId from "short-unique-id";

export class LibsqlRepo implements IDataRepo {
  private uid: ShortUniqueId;
  private client: LibsqlClient;
  public static allColumns =
    "session_id,path,timestamp,ip,user_agent,referrer,language,country,screen_width,screen_height,window_width,window_height,bot_name,bot_category,bot_url,bot_producer_name,bot_producer_url,client_type,client_name,client_version,client_engine,client_engine_version,device_type,device_brand,device_model,os_name,os_version,os_platform";
  public static allColumnsValues =
    ":session_id,:path,:timestamp,:ip,:user_agent,:referrer,:language,:country,:screen_width,:screen_height,:window_width,:window_height,:bot_name,:bot_category,:bot_url,:bot_producer_name,:bot_producer_url,:client_type,:client_name,:client_version,:client_engine,:client_engine_version,:device_type,:device_brand,:device_model,:os_name,:os_version,:os_platform";

  constructor() {
    this.uid = new ShortUniqueId({ length: 7 });

    if (!process.env.LIBSQL_URL || !process.env.LIBSQL_TOKEN) {
      throw new Error("LIBSQL_URL is not set");
    }

    this.client = createClient({
      url: process.env.LIBSQL_URL,
      authToken: process.env.LIBSQL_TOKEN,
      tls: process.env.LIBSQL_SSL_DISABLE === "true" ? false : true,
    });
  }

  async createEvent(event: WebEvent) {
    await this.client.execute({
      sql: `
      insert into events (${LibsqlRepo.allColumns})
      values (${LibsqlRepo.allColumnsValues})`,
      args: webEventToSqlFormat(event),
    });
  }

  async getSessionsPerDay(appId: string, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT strftime('%Y', timestamp) as year,
               strftime('%m', timestamp) as month,
               strftime('%d', timestamp) as day,
               COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY year, month, day
        ORDER BY year, month, day
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
      },
    });

    return result.rows as unknown as SessionItem[];
  }

  async getHitsPerPage(appId: string, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT path,
               COUNT(path) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY path
        ORDER BY count DESC, path ASC
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
      },
    });

    return result.rows as unknown as CountHitsPerPage[];
  }

  async getUniqueSessionsPerPage(appId: string, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT path,
               COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY path
        ORDER BY count DESC, path ASC
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
      },
    });

    return result.rows as unknown as CountHitsPerPage[];
  }

  async getTopReferrers(appId: string, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT referrer,
               COUNT(referrer) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY referrer
        ORDER BY count DESC, referrer ASC
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
      },
    });

    return result.rows as unknown as CountByReferrer[];
  }

  async getUniqueSessionsByCountry(appId: string, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT country,
               COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY country
        ORDER BY count DESC, country ASC
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
      },
    });

    return result.rows as unknown as CountByCountry[];
  }

  async getStats(appId: string, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT 
        (
          SELECT COUNT(DISTINCT session_id)
          FROM events
          WHERE timestamp >= :start
          AND app_id = :appId
        ) as uniqueVisitors,
        (
          select COUNT(path) as totalPageviews FROM events
          WHERE timestamp >= :start
          AND app_id = :appId
        ) as totalPageviews,
        (
          SELECT AVG(viewsPerVisitor) FROM (
            SELECT session_id, COUNT(*) as viewsPerVisitor
            FROM events
            WHERE timestamp >= :start
            AND app_id = :appId
            GROUP BY session_id
          )
        ) as viewsPerVisitor
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
      },
    });

    const response: Stats = {
      uniqueVisitors: result.rows[0].uniqueVisitors as number,
      totalPageviews: result.rows[0].totalPageviews as number,
      viewsPerVisitor: Math.round((result.rows[0].viewsPerVisitor as number) * 100) / 100,
    };

    return response;
  }

  async getSessionCountByUserAgent(appId: string, key: UserAgentQueryKeys, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT '${key}' as "key", ${key} as value, COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY :key
        ORDER BY count DESC, value ASC
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
        key,
      },
    });

    return result.rows as unknown as CountByKeyValue[];
  }

  async getSessionCountByUtmTag(appId: string, key: UtmTagKey, numberOfDays = 30) {
    const result = await this.client.execute({
      sql: `
        SELECT '${key}' as "key", ${key} as value, COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start
        AND app_id = :appId
        GROUP BY :key
        ORDER BY count DESC, value ASC
      `,
      args: {
        appId,
        start: getDaysAgo(numberOfDays).toISOString(),
        key,
      },
    });

    return result.rows as unknown as CountByKeyValue[];
  }

  async hasAnyEvents() {
    const result = await this.client.execute("select * from events limit 1");
    return result.rows.length > 0;
  }

  async connect() {}

  async disconnect() {
    this.client.close();
  }

  db() {
    return this.client;
  }

  async startExport() {
    const newId = v4();
    const newFile = await file({ name: `${newId}.jsonl` });

    await this.client.execute({
      sql: `
        insert into data_io (id, type, status, file_path)
        values (:newId, 'export', 'pending', :newFile)
      `,
      args: {
        newId,
        newFile: newFile.path,
      },
    });

    this.performExport(newFile.path, newId);
  }

  private async performExport(filePath: string, id: string) {
    const limit = 5000;
    console.log("Starting export to", filePath);
    let cursor = "1970-01-01T00:00:00.000Z";
    while (true) {
      console.log("Exporting from", cursor);
      const rs = await this.client.execute({
        sql: `
          select * from events
          where timestamp > :cursor
          order by timestamp asc
          limit :limit
        `,
        args: { limit, cursor },
      });

      await fs.appendFile(filePath, rs.rows.map((row) => JSON.stringify(row)).join("\n"));

      if (rs.rows.length < limit) {
        break;
      } else {
        cursor = rs.rows[rs.rows.length - 1].timestamp as string;
      }
    }

    await this.client.execute({
      sql: `update data_io set status = 'complete', file_path = :filePath where id = :id`,
      args: { filePath, id },
    });

    console.log("Export complete");
  }

  async listDataIo() {
    const results = await this.client.execute(`select * from data_io`);
    return results.rows as unknown as DataIo[];
  }

  async deleteDataIo(id: string) {
    await this.client.execute({
      sql: `delete from data_io where id = :id`,
      args: { id },
    });
  }

  async listApps() {
    const results = await this.client.execute(`select * from apps`);
    return results.rows as unknown as App[];
  }
  async createApp(name: string): Promise<void> {
    const id = this.uid.randomUUID();
    await this.client.execute({
      sql: `insert into apps (id, name, urls) values (:id, :name, '')`,
      args: { id, name },
    });
  }
  async updateApp(id: string, name: string) {
    await this.client.execute({
      sql: `update apps set name = :name where id = :id`,
      args: { id, name },
    });
  }
  async deleteApp(id: string) {
    await this.client.execute({
      sql: `delete from apps where id = :id`,
      args: { id },
    });
  }
}
