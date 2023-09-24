import { getTimescaleRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getTimescaleRepo().db();

  await sql`CREATE EXTENSION IF NOT EXISTS TimescaleDB`;

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      session_id TEXT NOT NULL,
      path TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
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
  `;

  await sql`SELECT create_hypertable('events', 'timestamp');`;

  return true;
}

export default migrate;
