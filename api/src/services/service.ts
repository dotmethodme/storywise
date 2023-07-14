import { cols, databaseName, mongoClient } from "../database";
import { WebEvent } from "../types/models";

export async function createEvent(event: WebEvent): Promise<void> {
  await mongoClient.db(databaseName).collection(cols.events).insertOne(event);
}

export async function getSessionsPerDay(numberOfDays = 7): Promise<Array<Record<string, unknown>>> {
  const startDate = new Date(new Date().getTime() - numberOfDays * 24 * 60 * 60 * 1000);
  const endDate = new Date();
  const results = await mongoClient
    .db(databaseName)
    .collection(cols.events)
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
  const results = await mongoClient
    .db(databaseName)
    .collection(cols.events)
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
  const results = await mongoClient
    .db(databaseName)
    .collection(cols.events)
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

export async function getTopReferrers(number_of_days: number = 30): Promise<any[]> {
  const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const results = await mongoClient
    .db(databaseName)
    .collection(cols.events)
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

export async function getUniqueSessionsByCountry(number_of_days: number = 30): Promise<any[]> {
  const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const results = await mongoClient
    .db(databaseName)
    .collection(cols.events)
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

export async function getStats(number_of_days: number = 30): Promise<Stats[]> {
  const startDate = new Date(new Date().getTime() - number_of_days * 24 * 60 * 60 * 1000);
  const endDate = new Date();

  const [uniqueVisitors, totalPageviews, viewsPerVisitor] = await Promise.all([
    mongoClient
      .db(databaseName)
      .collection(cols.events)
      .aggregate<Stats[]>([
        { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$session_id" } },
        { $count: "uniqueVisitors" },
        { $project: { _id: 0 } },
      ])
      .toArray(),
    mongoClient
      .db(databaseName)
      .collection(cols.events)
      .aggregate<Stats[]>([
        { $match: { timestamp: { $gte: startDate, $lt: endDate } } },
        { $count: "path" },
        { $project: { _id: 0, totalPageviews: "$path" } },
      ])
      .toArray(),
    mongoClient
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

  const result = {
    ...uniqueVisitors[0],
    ...totalPageviews[0],
    ...viewsPerVisitor[0],
  };

  result.viewsPerVisitor = Math.round(result.viewsPerVisitor * 100) / 100;

  return result;
}

export async function hasAnyEvents() {
  const result = await mongoClient.db(databaseName).collection(cols.events).findOne({});
  return !!result;
}
