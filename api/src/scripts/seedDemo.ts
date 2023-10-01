import { get } from "http";
import { LibsqlRepo } from "../repository/libsql";
import { cols } from "../repository/mongo";
import { PostgresRepo } from "../repository/postgres";
import { getLibsqlRepo, getMongoRepo, getPostgresRepo, getTimescaleRepo } from "../repository/repo";
import { TimescaleRepo } from "../repository/timescale";
import { WebEvent } from "../types/models";
import { getDaysAgoRandomTime } from "../utils/date";
import { webEventToSqlFormat } from "../utils/parsers";
import { generateUsers, getRandomPath, getRandomReferrer, getRandomScreenSize } from "./seedDemoData";

export async function seedDemo(logs = true, userCount = 1000, daysCount = 365) {
  const logger = logs ? console.log : () => {};

  const users = generateUsers(userCount);

  let events: WebEvent[] = [];

  async function flush() {
    await insertData(events, logs);
    events = [];
  }

  async function tryFlush() {
    if (events.length >= 1000) {
      await flush();
    }
  }

  await clearData();

  for (var i = 0; i < daysCount; i++) {
    logger(`Generating data for day ${i}`);

    const numberOfUsers = Math.floor(Math.random() * users.length);
    const usersForDate = users.slice(0, numberOfUsers);

    for (const user of usersForDate) {
      // generate a random number of events for each user
      const numberOfEvents = Math.floor(Math.random() * 10);

      for (let j = 0; j < numberOfEvents; j++) {
        const event = {
          ...user,
          app_id: "default",
          timestamp: getDaysAgoRandomTime(i),
          path: getRandomPath(),
          screen_width: user.screen_size_temp.width,
          screen_height: user.screen_size_temp.height,
          window_width: user.screen_size_temp.width,
          window_height: user.screen_size_temp.height,
          window: getRandomScreenSize(),
          referrer: getRandomReferrer(),
        };

        // @ts-ignore
        delete event.screen_size_temp;

        events.push(event);

        await tryFlush();
      }
    }
  }

  await flush();
}

async function clearData() {
  if (process.env.MONGODB_URI) {
    const repo = getMongoRepo();
    await repo.connect();
    const db = repo.db();
    await db.collection(cols.events).deleteMany({});
    await repo.disconnect();
  } else if (process.env.LIBSQL_URL) {
    const repo = getLibsqlRepo();
    const db = repo.db();
    await db.execute("DELETE FROM events");
  } else if (process.env.POSTGRES_URL) {
    const repo = new PostgresRepo();
    const db = repo.db();
    await db`DELETE FROM events`;
    await repo.disconnect();
  } else if (process.env.TIMESCALEDB_URL) {
    const repo = new TimescaleRepo();
    const db = repo.db();
    await db`DELETE FROM events`;
    await repo.disconnect();
  }
}

async function insertData(events: WebEvent[], logs: boolean) {
  const logger = logs ? console.log : () => {};

  if (process.env.MONGODB_URI) {
    const repo = getMongoRepo();
    await repo.connect();
    await repo.db().collection(cols.events).insertMany(events);
  } else if (process.env.LIBSQL_URL) {
    const repo = getLibsqlRepo();
    await repo.db().batch(
      events.map((event) => ({
        sql: `
            INSERT INTO events (${LibsqlRepo.allColumns})
            VALUES (${LibsqlRepo.allColumnsValues})
          `,
        args: webEventToSqlFormat(event),
      }))
    );
  } else if (process.env.POSTGRES_URL) {
    const repo = getPostgresRepo();
    const sql = repo.db();
    await sql`
      INSERT INTO events ${sql(events.map((event) => webEventToSqlFormat(event)))}
    `;
  } else if (process.env.TIMESCALEDB_URL) {
    const repo = getTimescaleRepo();
    const sql = repo.db();
    await sql`
      INSERT INTO events ${sql(events.map((event) => webEventToSqlFormat(event)))}
    `;
  }

  logger(`Inserted ${events.length} events`);
}
