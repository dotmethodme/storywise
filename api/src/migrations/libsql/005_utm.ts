import { getLibsqlRepo } from "../../repository/repo";

async function migrate(): Promise<boolean> {
  const db = getLibsqlRepo().db();

  await db.executeMultiple(`
    ALTER TABLE events ADD COLUMN utm_source TEXT;
    ALTER TABLE events ADD COLUMN utm_medium TEXT;
    ALTER TABLE events ADD COLUMN utm_campaign TEXT;
    ALTER TABLE events ADD COLUMN utm_term TEXT;
    ALTER TABLE events ADD COLUMN utm_content TEXT;
  `);

  return true;
}

export default migrate;
