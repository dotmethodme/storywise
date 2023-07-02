import { Request } from "express";
import { MongoClient } from "mongodb";
import UAParser from "ua-parser-js";
import { WebEvent } from "./types/models";
import fs from "fs";
import path from "path";

const uri = process.env.MONGODB_URI!;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const databaseName = process.env.DATABASE_NAME || "analytics";
const collectionName = "events";
const client = new MongoClient(uri);

export async function connect() {
  await client.connect();
}

export async function disconnect() {
  await client.close();
}

export async function createEvent(event: WebEvent): Promise<void> {
  await client.db(databaseName).collection(collectionName).insertOne(event);
}

export async function getSessionsPerDay(numberOfDays = 7): Promise<Array<Record<string, unknown>>> {
  const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
  const endDate = new Date();
  const results = await client
    .db(databaseName)
    .collection(collectionName)
    .aggregate([
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

export async function getHitsPerPage(numberOfDays = 7): Promise<Array<Record<string, unknown>>> {
  const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
  const endDate = new Date();
  const results = await client
    .db(databaseName)
    .collection(collectionName)
    .aggregate([
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

export async function getUniqueSessionsPerPage(numberOfDays = 7): Promise<Array<Record<string, unknown>>> {
  const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
  const endDate = new Date();
  const results = await client
    .db(databaseName)
    .collection(collectionName)
    .aggregate([
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

export async function getTopReferrers(number_of_days: number = 7): Promise<any[]> {
  const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const results = await client
    .db(databaseName)
    .collection(collectionName)
    .aggregate([
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

export async function getUniqueSessionsByCountry(number_of_days: number = 7): Promise<any[]> {
  const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const results = await client
    .db(databaseName)
    .collection(collectionName)
    .aggregate([
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

type Stats = {
  uniqueVisitors: number;
  totalPageviews: number;
  viewsPerVisitor: number;
};

export async function getStats(number_of_days: number = 7): Promise<Stats[]> {
  const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const [uniqueVisitors, totalPageviews, viewsPerVisitor] = await Promise.all([
    client
      .db(databaseName)
      .collection(collectionName)
      .aggregate<Stats[]>([
        { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$session_id" } },
        { $count: "uniqueVisitors" },
        { $project: { _id: 0 } },
      ])
      .toArray(),
    client
      .db(databaseName)
      .collection(collectionName)
      .aggregate<Stats[]>([
        { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
        { $count: "path" },
        { $project: { _id: 0, totalPageviews: "$path" } },
      ])
      .toArray(),
    client
      .db(databaseName)
      .collection(collectionName)
      .aggregate<Stats>([
        { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$session_id", count: { $sum: 1 } } },
        { $group: { _id: null, viewsPerVisitor: { $avg: "$count" } } },
        { $project: { _id: 0 } },
      ])
      .toArray(),
  ]);

  return {
    ...uniqueVisitors[0],
    ...totalPageviews[0],
    ...viewsPerVisitor[0],
  };
}

export function extractEvent(request: Request): WebEvent {
  const event: WebEvent = {
    session_id: request.body.session_id || request.fingerprint?.hash!,
    path: request.body.path,
    referrer: request.body.referrer,
    screen: request.body.screen,
    window: request.body.window,
  };

  event.timestamp = new Date();
  event.user_agent = request.headers["user-agent"] as string | null;
  event.language = request.headers["accept-language"] as string | null;
  event.country = request.headers["cf-ipcountry"] as string | null;
  event.ip = getIpFromRequest(request);

  if (event.user_agent) {
    let parser = new UAParser(event.user_agent);
    const user_agent = parser.getResult();

    event.browser = user_agent.browser;
    event.os = user_agent.os;
    event.device = user_agent.device;
    event.user_agent_enriched = user_agent;
  }

  return event;
}

function getIpFromRequest(req: Request) {
  let ip = req.headers["cf-connecting-ip"] as string;
  if (ip) return ip;

  ip = req.headers["x-real-ip"] as string;
  if (ip) return ip;

  ip = req.headers["x-forwarded-for"] as string;
  if (ip) return ip;

  return req.ip;
}

const jsFile = path.join(__dirname, "../templates/script.js");
const jsFileContent = fs.readFileSync(jsFile, "utf8");

export async function getAnalyticsCode() {
  return jsFileContent.replace("{{API_BASE_URL}}", API_BASE_URL);
}
