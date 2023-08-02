import { getLibsqlRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const db = getLibsqlRepo().db();

  db.execute(`
    CREATE TABLE events (
      session_id TEXT NOT NULL,
      path TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      ip TEXT,
      user_agent TEXT,
      referrer TEXT,
      language TEXT,
      country TEXT,
      screen_width INTEGER,
      screen_height INTEGER,
      window_width INTEGER,
      window_height INTEGER,
      bot_name TEXT,
      bot_category TEXT,
      bot_url TEXT,
      bot_producer_name TEXT,
      bot_producer_url TEXT,
      client_type TEXT,
      client_name TEXT,
      client_version TEXT,
      client_engine TEXT,
      client_engine_version TEXT,
      device_type TEXT,
      device_brand TEXT,
      device_model TEXT,
      os_name TEXT,
      os_version TEXT,
      os_platform TEXT
    );
  `);

  return true;
}

export default migrate;
