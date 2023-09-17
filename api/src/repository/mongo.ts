import {
  CountByCountry,
  CountByKeyValue,
  CountByReferrer,
  CountHitsPerPage,
  SessionItem,
  Stats,
  UserAgentQueryKeys,
} from "@shared/types";
import { MongoClient } from "mongodb";
import { WebEvent } from "../types/models";
import { IDataRepo } from "./types";

export const databaseName = process.env.DATABASE_NAME || "analytics";
export const cols = {
  events: "events",
  migrations: "migrations",
};

export class MongoRepo implements IDataRepo {
  private client: MongoClient;

  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set");
    }
    this.client = new MongoClient(process.env.MONGODB_URI);
  }

  getSessionCountByUserAgent(key: UserAgentQueryKeys, numberOfDays = 30): Promise<CountByKeyValue[]> {
    throw new Error("Method not implemented.");
  }

  async createEvent(event: WebEvent) {
    await this.client.db(databaseName).collection(cols.events).insertOne(event);
  }

  async getSessionsPerDay(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();
    const results = await this.client
      .db(databaseName)
      .collection(cols.events)
      .aggregate<SessionItem>([
        {
          $match: {
            timestamp: { $gte: startDate, $lt: endDate },
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

  async getHitsPerPage(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();
    const results = await this.client
      .db(databaseName)
      .collection(cols.events)
      .aggregate<CountHitsPerPage>([
        {
          $match: {
            timestamp: { $gte: startDate, $lt: endDate },
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

  async getUniqueSessionsPerPage(numberOfDays = 30) {
    const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
    const endDate = new Date();
    const results = await this.client
      .db(databaseName)
      .collection(cols.events)
      .aggregate<CountHitsPerPage>([
        {
          $match: {
            timestamp: { $gte: startDate, $lt: endDate },
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

  async getTopReferrers(number_of_days = 30) {
    const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const results = await this.client
      .db(databaseName)
      .collection(cols.events)
      .aggregate<CountByReferrer>([
        {
          $match: {
            timestamp: { $gte: startDate, $lt: endDate },
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

  async getUniqueSessionsByCountry(number_of_days = 30) {
    const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const results = await this.client
      .db(databaseName)
      .collection(cols.events)
      .aggregate<CountByCountry>([
        {
          $match: {
            timestamp: { $gte: startDate, $lt: endDate },
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

  async getStats(number_of_days = 30) {
    const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    const [uniqueVisitors, totalPageviews, viewsPerVisitor] = await Promise.all([
      this.client
        .db(databaseName)
        .collection(cols.events)
        .aggregate<Stats[]>([
          { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
          { $group: { _id: "$session_id" } },
          { $count: "uniqueVisitors" },
          { $project: { _id: 0 } },
        ])
        .toArray(),
      this.client
        .db(databaseName)
        .collection(cols.events)
        .aggregate<Stats[]>([
          { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
          { $count: "path" },
          { $project: { _id: 0, totalPageviews: "$path" } },
        ])
        .toArray(),
      this.client
        .db(databaseName)
        .collection(cols.events)
        .aggregate<Stats>([
          { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
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
}
