import { getLibsqlRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const db = getLibsqlRepo().db();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS apps (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      urls TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
      updated_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
    );
  `);

  await db.execute(`
    INSERT INTO apps (id, name, urls)
    VALUES ('default', 'Default', '')
    ON CONFLICT (id) DO NOTHING
  `);

  await db.execute(`
    ALTER TABLE events
    ADD COLUMN app_id TEXT REFERENCES apps(id) NOT NULL DEFAULT 'default'
  `);

  return true;
}

export default migrate;
