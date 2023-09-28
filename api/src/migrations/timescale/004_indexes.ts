import { getTimescaleRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getTimescaleRepo().db();

  await sql`CREATE INDEX IF NOT EXISTS idx_events_app_id ON events (app_id);`;

  return true;
}

export default migrate;
