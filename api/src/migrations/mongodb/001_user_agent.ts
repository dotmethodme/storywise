import { IResult } from "ua-parser-js";
import { cols, db } from "../../database";
import DeviceDetector from "device-detector-js";
import { ObjectId, UpdateOneModel } from "mongodb";
import { uaParserToModel } from "../../utils/extractEvent";

const deviceDetector = new DeviceDetector();

async function migrate() {
  const events = db()
    .collection(cols.events)
    .find<{
      _id: ObjectId;
      timestamp: Date;
      user_agent?: string | null;
      user_agent_enriched?: IResult | null;
    }>(
      {},
      {
        projection: {
          _id: 1,
          timestamp: 1,
          user_agent: 1,
          user_agent_enriched: 1,
        },
      }
    )
    .sort({
      timestamp: 1,
    });

  let batch: { updateOne: UpdateOneModel }[] = [];

  for await (const event of events) {
    if (event.user_agent) {
      const ua = deviceDetector.parse(event.user_agent);
      const data = uaParserToModel(ua);

      batch.push({ updateOne: { filter: { _id: event._id }, update: { $set: data } } });

      if (batch.length >= 1000) {
        await db().collection(cols.events).bulkWrite(batch);
        batch = [];
      }
    }
  }

  if (batch.length > 0) {
    await db().collection(cols.events).bulkWrite(batch);
  }

  await db()
    .collection(cols.events)
    .updateMany({}, { $unset: { user_agent_enriched: 1 } });

  return true;
}

export default migrate;
