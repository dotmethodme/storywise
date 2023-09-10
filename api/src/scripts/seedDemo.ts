import { LibsqlRepo } from "../repository/libsql";
import { cols } from "../repository/mongo";
import { PostgresRepo } from "../repository/postgres";
import { getLibsqlRepo, getMongoRepo } from "../repository/repo";
import { WebEvent } from "../types/models";
import { webEventToSqlFormat } from "../utils/parsers";
import { generateUsers, getRandomPath, getRandomReferrer, getRandomScreenSize } from "./seedDemoData";

export async function seedDemo(logs = true) {
  const users = generateUsers(100);

  const events: WebEvent[] = [];
  const numberOfDays = 100;

  for (var i = 0; i < numberOfDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const numberOfUsers = Math.floor(Math.random() * users.length);
    const usersForDate = users.slice(0, numberOfUsers);

    for (const user of usersForDate) {
      // generate a random number of events for each user
      const numberOfEvents = Math.floor(Math.random() * 10);

      for (let j = 0; j < numberOfEvents; j++) {
        const event = {
          ...user,
          timestamp: date,
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
      }
    }
  }

  await insertData(events, logs);
}

async function insertData(events: WebEvent[], logs: boolean) {
  const logger = logs ? console.log : () => {};

  const batches = splitInBatches(events, 500);

  if (!!process.env.MONGODB_URI) {
    const repo = getMongoRepo();
    await repo.connect();

    const db = repo.db();

    // empty the events collection
    await db.collection(cols.events).deleteMany({});

    for (const batch of batches) {
      await db.collection(cols.events).insertMany(batch);
      logger(`Inserted ${batch.length} events`);
    }
  } else if (!!process.env.LIBSQL_URL) {
    const repo = getLibsqlRepo();
    const db = repo.db();
    await db.execute("DELETE FROM events");

    for (const batch of batches) {
      await db.batch(
        batch.map((event) => ({
          sql: `
            INSERT INTO events (${LibsqlRepo.allColumns})
            VALUES (${LibsqlRepo.allColumnsValues})
          `,
          args: webEventToSqlFormat(event),
        }))
      );

      logger(`Inserted ${batch.length} events`);
    }
  } else if (!!process.env.POSTGRES_URL) {
    const repo = new PostgresRepo();
    const db = repo.db();
    await db`DELETE FROM events`;

    for (const batch of batches) {
      await db.begin(async (sql) => {
        const events = batch.map((event) => webEventToSqlFormat(event));
        await sql`
          INSERT INTO events ${sql(events)}
        `;
      });

      logger(`Inserted ${batch.length} events`);
    }
  }
}

function splitInBatches<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}
