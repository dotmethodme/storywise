import { getTimescaleRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getTimescaleRepo().db();

  await sql`
    CREATE TABLE IF NOT EXISTS data_io (
      id UUID PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      file_path TEXT,
      data JSONB
    );
  `;

  return true;
}

export default migrate;
