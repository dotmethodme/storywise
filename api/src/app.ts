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
  getCountSessionsByUtmHandler,
} from "./routes/counts";
import {
  healthCheckHandler,
  siteConfigHandler,
  getHeadersHandler,
  getJsFileHandler,
  hasEventsHandler,
  getVersionHandler,
} from "./routes/misc";
import { deleteDataIoHandler, downloadFileHandler, listDataIoHandler, startExportHandler } from "./routes/dataIO";
import * as appHandlers from "./routes/app";

const isLocalEnv = process.env.NODE_ENV === "local";

export function getApp() {
  const frontendPath = "dist-frontend";
  const app = express();

  // Middleware
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(cors({ origin: config.ALLOWED_ORIGIN, credentials: true }));
  app.use(express.json());

  // Basic
  app.get("/", (_, res) => res.redirect("/admin"));
  app.get("/health", healthCheckHandler);
  app.get("/api/headers", getHeadersHandler);
  app.get("/api/version", getVersionHandler);

  // Events
  app.post("/api/event", createEventHandler);
  app.get("/api/event", cors(), getEventHandler);
  app.options("/api/event", cors());

  // Counts
  app.get("/admin/api/sessions_per_day", authMiddleware, getSessionsPerDayHandler);
  app.get("/admin/api/hits_per_page", authMiddleware, getHitsPerPageHandler);
  app.get("/admin/api/unique_sessions_per_page", getUniqueSessionsPerPageHandler);
  app.get("/admin/api/top_referrers", authMiddleware, getTopReferrersHandler);
  app.get("/admin/api/unique_sessions_by_country", authMiddleware, getUniqueSessionsByCountryHandler);
  app.get("/admin/api/count_sessions_by_user_agent", authMiddleware, getCountSessionsByUserAgentHandler);
  app.get("/admin/api/count_sessions_by_utm", authMiddleware, getCountSessionsByUtmHandler);
  app.get("/admin/api/stats", authMiddleware, getStatsHandler);
  app.get("/admin/api/config", authMiddleware, siteConfigHandler);
  app.get("/admin/api/has-events", authMiddleware, hasEventsHandler);

  // Export
  app.get("/admin/api/export/start", authMiddleware, startExportHandler);
  app.get("/admin/api/data_io/list", authMiddleware, listDataIoHandler);
  app.delete("/admin/api/data_io/:id", authMiddleware, deleteDataIoHandler);
  app.get("/admin/api/data_io/download_file", authMiddleware, downloadFileHandler);
  app.get("/admin/api/data_io/storywise_export.jsonl", authMiddleware, downloadFileHandler);

  // Apps
  app.get("/admin/api/apps", authMiddleware, appHandlers.list);
  app.post("/admin/api/apps", authMiddleware, appHandlers.create);
  app.put("/admin/api/apps", authMiddleware, appHandlers.update);
  app.delete("/admin/api/apps", authMiddleware, appHandlers.remove);

  // Auth
  app.get("/login/:token", jwtAuthMiddleware);

  // Frontend
  if (isLocalEnv) {
    app.get("/admin", authMiddleware, proxy("localhost:5173"));
    app.get("/admin/*", authMiddleware, proxy("localhost:5173"));
  } else {
    app.use("/admin", authMiddleware, express.static(frontendPath));
  }

  // Scripts
  app.get("/js/script.js", getJsFileHandler);

  return app;
}
