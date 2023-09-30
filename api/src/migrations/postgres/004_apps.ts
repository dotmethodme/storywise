import { getPostgresRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const sql = getPostgresRepo().db();

  await sql`
    CREATE TABLE IF NOT EXISTS apps (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      urls TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO apps (id, name)
    VALUES ('default', 'Default')
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS app_id TEXT REFERENCES apps(id) NOT NULL DEFAULT 'default'
  `;

  return true;
}

export default migrate;
