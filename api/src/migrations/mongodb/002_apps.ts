import { cols } from "../../repository/mongo";
import { getMongoRepo } from "../../repository/repo";

async function migrate() {
  const db = getMongoRepo().db();

  await db.collection(cols.events).updateMany({}, { $set: { app_id: "default" } });
  await db.collection(cols.events).createIndex({ app_id: 1, timestamp: 1 });
  await db.collection(cols.apps).insertOne({
    id: "default",
    name: "Default",
    created_at: new Date(),
    updated_at: new Date(),
    urls: "",
  });

  return true;
}

export default migrate;
