import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth";
import { jwtAuthMiddleware } from "./middlewares/jwtAuth";
import { config } from "./utils/config";
import { createEventHandler, getEventHandler } from "./routes/events";
import {
  getSessionsPerDayHandler,
  getHitsPerPageHandler,
  getUniqueSessionsPerPageHandler,
  getTopReferrersHandler,
  getUniqueSessionsByCountryHandler,
  getCountSessionsByUserAgentHandler,
  getStatsHandler,
} from "./routes/counts";
import { healthCheckHandler, siteConfigHandler, getHeadersHandler, getJsFileHandler } from "./routes/misc";
import { startExportHandler } from "./routes/dataIO";

const isLocalEnv = process.env.NODE_ENV === "local";

export function getApp() {
  const frontendPath = "dist-frontend";
  const app = express();

  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(cors({ origin: config.ALLOWED_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get("/", (_, res) => res.redirect("/admin"));
  app.get("/health", healthCheckHandler);

  app.post("/api/event", createEventHandler);
  app.get("/api/event", cors(), getEventHandler);
  app.options("/api/event", cors());

  app.get("/admin/api/sessions_per_day", authMiddleware, getSessionsPerDayHandler);
  app.get("/admin/api/hits_per_page", authMiddleware, getHitsPerPageHandler);
  app.get("/admin/api/unique_sessions_per_page", getUniqueSessionsPerPageHandler);
  app.get("/admin/api/top_referrers", authMiddleware, getTopReferrersHandler);
  app.get("/admin/api/unique_sessions_by_country", authMiddleware, getUniqueSessionsByCountryHandler);
  app.get("/admin/api/count_sessions_by_user_agent", authMiddleware, getCountSessionsByUserAgentHandler);
  app.get("/admin/api/stats", authMiddleware, getStatsHandler);
  app.get("/admin/api/config", authMiddleware, siteConfigHandler);
  app.get("/admin/api/export/start", authMiddleware, startExportHandler);
  app.get("/admin/api/export/check", authMiddleware, () => {});
  app.get("/admin/api/export/download/:id", authMiddleware, () => {});
  app.get("/login/:token", jwtAuthMiddleware);

  if (isLocalEnv) {
    app.get("/admin", authMiddleware, proxy("localhost:5173"));
    app.get("/admin/*", authMiddleware, proxy("localhost:5173"));
  } else {
    app.use("/admin", authMiddleware, express.static(frontendPath));
  }

  app.get("/api/headers", getHeadersHandler);
  app.get("/js/script.js", getJsFileHandler);

  return app;
}
