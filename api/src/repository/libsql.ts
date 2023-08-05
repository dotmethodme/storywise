import { SessionItem, HitsPerPage, Referrer, Country, Stats } from "@shared/types";
import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";
import { Client as LibsqlClient, createClient } from "@libsql/client";
import { undefinedValuesToNull, webEventToSqlFormat } from "../utils/parsers";

export class LibsqlRepo implements IDataRepo {
  private client: LibsqlClient;
  public static allColumns =
    "session_id,path,timestamp,ip,user_agent,referrer,language,country,screen_width,screen_height,window_width,window_height,bot_name,bot_category,bot_url,bot_producer_name,bot_producer_url,client_type,client_name,client_version,client_engine,client_engine_version,device_type,device_brand,device_model,os_name,os_version,os_platform";
  public static allColumnsValues =
    ":session_id,:path,:timestamp,:ip,:user_agent,:referrer,:language,:country,:screen_width,:screen_height,:window_width,:window_height,:bot_name,:bot_category,:bot_url,:bot_producer_name,:bot_producer_url,:client_type,:client_name,:client_version,:client_engine,:client_engine_version,:device_type,:device_brand,:device_model,:os_name,:os_version,:os_platform";

  constructor() {
    if (!process.env.LIBSQL_URL || !process.env.LIBSQL_TOKEN) {
      throw new Error("LIBSQL_URL is not set");
    }

    this.client = createClient({
      url: process.env.LIBSQL_URL,
      authToken: process.env.LIBSQL_TOKEN,
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

  async getSessionsPerDay(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();
    const result = await this.client.execute({
      sql: `
        SELECT strftime('%Y', timestamp) as year,
               strftime('%m', timestamp) as month,
               strftime('%d', timestamp) as day,
               COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start AND timestamp < :end
        GROUP BY year, month, day
        ORDER BY year, month, day
      `,
      args: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    return result.rows as unknown as SessionItem[];
  }

  async getHitsPerPage(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const result = await this.client.execute({
      sql: `
        SELECT path,
               COUNT(path) as count
        FROM events
        WHERE timestamp >= :start AND timestamp < :end
        GROUP BY path
        ORDER BY count DESC, path ASC
      `,
      args: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    return result.rows as unknown as HitsPerPage[];
  }

  async getUniqueSessionsPerPage(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const result = await this.client.execute({
      sql: `
        SELECT path,
               COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start AND timestamp < :end
        GROUP BY path
        ORDER BY count DESC, path ASC
      `,
      args: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    return result.rows as unknown as HitsPerPage[];
  }

  async getTopReferrers(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const result = await this.client.execute({
      sql: `
        SELECT referrer,
               COUNT(referrer) as count
        FROM events
        WHERE timestamp >= :start AND timestamp < :end
        GROUP BY referrer
        ORDER BY count DESC, referrer ASC
      `,
      args: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    return result.rows as unknown as Referrer[];
  }

  async getUniqueSessionsByCountry(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const result = await this.client.execute({
      sql: `
        SELECT country,
               COUNT(DISTINCT session_id) as count
        FROM events
        WHERE timestamp >= :start AND timestamp < :end
        GROUP BY country
        ORDER BY count DESC, country ASC
      `,
      args: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    return result.rows as unknown as Country[];
  }

  async getStats(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const result = await this.client.execute({
      sql: `
        SELECT 
        (
          SELECT COUNT(DISTINCT session_id)
          FROM events
          WHERE timestamp >= :start AND timestamp < :end
        ) as uniqueVisitors,
        (
          select COUNT(path) as totalPageviews FROM events
          WHERE timestamp >= :start AND timestamp < :end
        ) as totalPageviews,
        (
          SELECT AVG(viewsPerVisitor) FROM (
            SELECT session_id, COUNT(*) as viewsPerVisitor
            FROM events
            WHERE timestamp >= :start AND timestamp < :end
            GROUP BY session_id
          )
        ) as viewsPerVisitor
      `,
      args: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    const response: Stats = {
      uniqueVisitors: result.rows[0].uniqueVisitors as number,
      totalPageviews: result.rows[0].totalPageviews as number,
      viewsPerVisitor: Math.round((result.rows[0].viewsPerVisitor as number) * 100) / 100,
    };

    return response;
  }

  async hasAnyEvents() {
    const result = await this.client.execute("select * from events limit 1");
    return result.rows.length > 0;
  }

  async connect() {
    // noop - libsql connects on demand
  }

  async disconnect() {
    this.client.close();
  }

  db() {
    return this.client;
  }
}
