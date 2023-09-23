import { getLibsqlRepo, getPostgresRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const db = getLibsqlRepo().db();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS data_io (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
      updated_at TIMESTAMP NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
      file_path TEXT,
      data JSON 
    );
  `);

  return true;
}

export default migrate;
