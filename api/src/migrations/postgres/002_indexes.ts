import { getPostgresRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getPostgresRepo().db();

  await sql`
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events (timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp_path ON events (timestamp, path);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp_path_unique_sessions ON events (timestamp, path, session_id);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp_referrer ON events (timestamp, referrer);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp_country ON events (timestamp, country);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp_session_id ON events (timestamp, session_id);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp_path ON events (timestamp, path);
  `;

  return true;
}

export default migrate;
