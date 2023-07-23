require("dotenv").config();
import { cols } from "../repository/mongo";
import { getDataRepo, getMongoRepo } from "../repository/repo";
import { WebEvent } from "../types/models";
import { generateUsers, getRandomPath, getRandomReferrer, getRandomScreenSize } from "./seedDemoData";

async function main() {
  const repo = getMongoRepo();
  await repo.connect();

  const db = repo.db();

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
        const event: WebEvent = {
          ...user,
          timestamp: date,
          path: getRandomPath(),
          screen: getRandomScreenSize(),
          window: getRandomScreenSize(),
          referrer: getRandomReferrer(),
        };
        events.push(event);
      }
    }
  }

  // empty the events collection
  await db.collection(cols.events).deleteMany({});

  const batches = splitInBatches(events, 500);
  for (const batch of batches) {
    await db.collection(cols.events).insertMany(batch);
    console.log(`Inserted ${batch.length} events`);
  }

  process.exit(0);
}

function splitInBatches<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

main();
