require("dotenv").config();
import { getApp } from "./app";
import { migrate } from "./migrations/migrations";
import { getDataRepo } from "./repository/repo";

(async () => {
  await getDataRepo().connect();
  await migrate();

  const app = getApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
