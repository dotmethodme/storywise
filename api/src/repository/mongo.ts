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
import { MongoClient } from "mongodb";
import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";
import { getDaysAgo } from "../utils/date";
import { v4 } from "uuid";
import fs from "fs/promises";
import { file } from "tmp-promise";
import { App } from "@shared/app";

export const databaseName = process.env.DATABASE_NAME || "analytics";
export const cols = {
  events: "events",
  migrations: "migrations",
  data_io: "data_io",
  apps: "apps",
};

export class MongoRepo implements IDataRepo {
  private client: MongoClient;

  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set");
    }
    this.client = new MongoClient(process.env.MONGODB_URI);
  }

  async createEvent(event: WebEvent) {
    await this.client.db(databaseName).collection(cols.events).insertOne(event);
  }

  async getSessionCountByUserAgent(app_id: string, key: UserAgentQueryKeys, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<CountByKeyValue>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: `$${key}`,
            value: { $first: `$${key}` },
            count: { $addToSet: "$session_id" },
          },
        },
        {
          $project: {
            _id: 0,
            key: { $literal: key },
            value: 1,
            count: { $size: "$count" },
          },
        },
        {
          $sort: {
            count: -1,
            value: 1,
          },
        },
      ])
      .toArray();

    return results;
  }

  async getSessionCountByUtmTag(app_id: string, key: UtmTagKey, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<CountByKeyValue>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: `$${key}`,
            value: { $first: `$${key}` },
            count: { $addToSet: "$session_id" },
          },
        },
        {
          $project: {
            _id: 0,
            key: { $literal: key },
            value: 1,
            count: { $size: "$count" },
          },
        },
        {
          $sort: {
            count: -1,
            value: 1,
          },
        },
      ])
      .toArray();

    return results;
  }

  async getSessionsPerDay(app_id: string, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<SessionItem>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
              session_id: "$session_id",
            },
          },
        },
        {
          $group: {
            _id: { year: "$_id.year", month: "$_id.month", day: "$_id.day" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            count: 1,
          },
        },
      ])
      .toArray();
    return results;
  }

  async getHitsPerPage(app_id: string, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<CountHitsPerPage>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: { path: "$path" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
            "_id.path": 1,
          },
        },
        {
          $project: {
            _id: 0,
            path: "$_id.path",
            count: 1,
          },
        },
      ])
      .toArray();
    return results;
  }

  async getUniqueSessionsPerPage(app_id: string, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<CountHitsPerPage>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: { path: "$path", session_id: "$session_id" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: { path: "$_id.path" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
            "_id.path": 1,
          },
        },
        {
          $project: {
            _id: 0,
            path: "$_id.path",
            count: 1,
          },
        },
      ])
      .toArray();
    return results;
  }

  async getTopReferrers(app_id: string, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<CountByReferrer>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: { referrer: "$referrer" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
            "_id.referrer": 1,
          },
        },
        {
          $project: {
            _id: 0,
            referrer: "$_id.referrer",
            count: 1,
          },
        },
      ])
      .toArray();
    return results;
  }

  async getUniqueSessionsByCountry(app_id: string, numberOfDays = 30) {
    const results = await this.db()
      .collection(cols.events)
      .aggregate<CountByCountry>([
        {
          $match: {
            timestamp: { $gte: getDaysAgo(numberOfDays) },
            app_id,
          },
        },
        {
          $group: {
            _id: { country: "$country", session_id: "$session_id" },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: { country: "$_id.country" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $project: {
            _id: 0,
            country: "$_id.country",
            count: 1,
          },
        },
      ])
      .toArray();
    return results;
  }

  async getStats(app_id: string, numberOfDays = 30) {
    const [uniqueVisitors, totalPageviews, viewsPerVisitor] = await Promise.all([
      this.db()
        .collection(cols.events)
        .aggregate<Stats[]>([
          { $match: { timestamp: { $gte: getDaysAgo(numberOfDays) }, app_id } },
          { $group: { _id: "$session_id" } },
          { $count: "uniqueVisitors" },
          { $project: { _id: 0 } },
        ])
        .toArray(),
      this.db()
        .collection(cols.events)
        .aggregate<Stats[]>([
          { $match: { timestamp: { $gte: getDaysAgo(numberOfDays) }, app_id } },
          { $count: "path" },
          { $project: { _id: 0, totalPageviews: "$path" } },
        ])
        .toArray(),
      this.db()
        .collection(cols.events)
        .aggregate<Stats>([
          { $match: { timestamp: { $gte: getDaysAgo(numberOfDays) }, app_id } },
          { $group: { _id: "$session_id", count: { $sum: 1 } } },
          { $group: { _id: null, viewsPerVisitor: { $avg: "$count" } } },
          { $project: { _id: 0 } },
        ])
        .toArray(),
    ]);

    const result: Stats = {
      ...uniqueVisitors[0],
      ...totalPageviews[0],
      ...viewsPerVisitor[0],
    };

    result.viewsPerVisitor = Math.round(result.viewsPerVisitor * 100) / 100;

    return result;
  }

  async hasAnyEvents() {
    const result = await this.client.db(databaseName).collection(cols.events).findOne({});
    return !!result;
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  public db() {
    return this.client.db(databaseName);
  }

  async startExport() {
    const newId = v4();
    const newFile = await file({ name: `${newId}.jsonl` });

    await this.db()
      .collection(cols.data_io)
      .insertOne({ id: newId, type: "export", status: "pending", file_path: newFile.path });

    await this.performExport(newFile.path, newId);
  }

  private async performExport(filePath: string, id: string) {
    const limit = 5000;
    console.log("Starting export to", filePath);
    let cursor: Date | undefined = undefined;

    while (true) {
      console.log("Exporting from", cursor?.toISOString());
      const rows = await this.db()
        .collection(cols.events)
        .find(cursor ? { timestamp: { $gt: cursor } } : {})
        .sort({ timestamp: 1 })
        .project({ _id: 0 })
        .limit(limit)
        .toArray();

      // Write rows to the export file
      await fs.appendFile(filePath, rows.map((row) => JSON.stringify(row)).join("\n"));

      if (rows.length === 0) {
        break;
      } else {
        cursor = rows[rows.length - 1].timestamp;
      }
    }

    // Update export status to 'complete'
    await this.db()
      .collection(cols.data_io)
      .updateOne({ id }, { $set: { status: "complete", file_path: filePath } });

    console.log("Export complete");
  }

  async listDataIo() {
    const results = await this.db().collection(cols.data_io).find<DataIo>({}).toArray();
    return results;
  }

  async deleteDataIo(id: string) {
    await this.db().collection(cols.data_io).deleteOne({ id });
  }

  async listApps() {
    return this.db().collection(cols.apps).find<App>({}).toArray();
  }

  async createApp(name: string) {
    await this.db()
      .collection(cols.apps)
      .insertOne({ id: v4(), name, created_at: new Date(), updated_at: new Date(), urls: "" });
  }

  async updateApp(id: string, name: string) {
    await this.db()
      .collection(cols.apps)
      .updateOne({ id }, { $set: { name, updated_at: new Date() } });
  }

  async deleteApp(id: string) {
    await this.db().collection(cols.apps).deleteOne({ id });
  }
}
