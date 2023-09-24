import { getLibsqlRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const db = getLibsqlRepo().db();

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events (timestamp);
  `);

  return true;
}

export default migrate;
