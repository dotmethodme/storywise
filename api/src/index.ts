require("dotenv").config();
import express from "express";
import Fingerprint from "express-fingerprint";
import {
  getEventHandler,
  getHeadersHandler,
  getHitsPerPageHandler,
  getJsFileHandler,
  getSessionsPerDayHandler,
  getTopReferrersHandler,
  getUniqueSessionsPerPageHandler,
  handleCreateEvent,
} from "./handlers";
import { authMiddleware } from "./middlewares/auth";
import { connect } from "./service";
import proxy from "express-http-proxy";

(async () => {
  const isLocalEnv = process.env.LOCAL_ENV === "true";
  const app = express();

  await connect();

  app.use(Fingerprint());

  app.use(express.json());

  app.post("/api/event", handleCreateEvent);
  app.get("/api/event", getEventHandler);

  app.get("/admin/api/sessions_per_day", authMiddleware, getSessionsPerDayHandler);
  app.get("/admin/api/hits_per_page", authMiddleware, getHitsPerPageHandler);
  app.get("/admin/api/unique_sessions_per_page", getUniqueSessionsPerPageHandler);
  app.get("/admin/api/top_referrers", authMiddleware, getTopReferrersHandler);
  app.get("/admin", authMiddleware, isLocalEnv ? proxy("localhost:5173") : express.static("public"));
  app.get("/admin/*", authMiddleware, isLocalEnv ? proxy("localhost:5173") : express.static("public"));
  app.get("/api/headers", getHeadersHandler);
  app.get("/js/script.js", getJsFileHandler);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
