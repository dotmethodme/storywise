require("dotenv").config();
import cors from "cors";
import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth";
import { migrate } from "./migrations/migrations";
import { getDataRepo } from "./repository/repo";
import {
  getEventHandler,
  getHeadersHandler,
  getHitsPerPageHandler,
  getJsFileHandler,
  getSessionsPerDayHandler,
  getStatsHandler,
  getTopReferrersHandler,
  getUniqueSessionsByCountryHandler,
  getUniqueSessionsPerPageHandler,
  handleCreateEvent,
  siteConfig,
} from "./routes";
import { config } from "./utils/config";

const isLocalEnv = process.env.NODE_ENV === "local";

(async () => {
  const frontendPath = "dist-frontend";
  const app = express();

  await getDataRepo().connect();
  await migrate();

  app.use(morgan("dev"));
  app.use(cors({ origin: config.ALLOWED_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get("/", (_, res) => res.redirect("/admin"));

  app.post("/api/event", handleCreateEvent);
  app.get("/api/event", cors(), getEventHandler);
  app.options("/api/event", cors());

  app.get("/admin/api/sessions_per_day", authMiddleware, getSessionsPerDayHandler);
  app.get("/admin/api/hits_per_page", authMiddleware, getHitsPerPageHandler);
  app.get("/admin/api/unique_sessions_per_page", getUniqueSessionsPerPageHandler);
  app.get("/admin/api/top_referrers", authMiddleware, getTopReferrersHandler);
  app.get("/admin/api/unique_sessions_by_country", authMiddleware, getUniqueSessionsByCountryHandler);
  app.get("/admin/api/stats", authMiddleware, getStatsHandler);
  app.get("/admin/api/config", authMiddleware, siteConfig);

  if (isLocalEnv) {
    app.get("/admin", authMiddleware, proxy("localhost:5173"));
    app.get("/admin/*", authMiddleware, proxy("localhost:5173"));
  } else {
    app.use("/admin", authMiddleware, express.static(frontendPath));
  }

  app.get("/api/headers", getHeadersHandler);
  app.get("/js/script.js", getJsFileHandler);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})();
