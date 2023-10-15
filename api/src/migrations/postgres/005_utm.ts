import { getPostgresRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getPostgresRepo().db();

  await sql`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS utm_source TEXT,
    ADD COLUMN IF NOT EXISTS utm_medium TEXT,
    ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
    ADD COLUMN IF NOT EXISTS utm_term TEXT,
    ADD COLUMN IF NOT EXISTS utm_content TEXT;
  `;

  return true;
}

export default migrate;
