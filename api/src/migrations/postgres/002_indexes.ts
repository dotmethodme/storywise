import { getPostgresRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getPostgresRepo().db();

  await sql`
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events (timestamp);
  `;

  return true;
}

export default migrate;
