import { Request, Response } from "express";
import { getDataRepo } from "../repository/repo";
import { getAnalyticsCode } from "../utils/analyticScript";
import { config } from "../utils/config";

export async function getJsFileHandler(req: Request, res: Response) {
  const fileContent = await getAnalyticsCode();
  res.setHeader("Content-Type", "application/javascript");
  res.end(fileContent);
}

export async function siteConfigHandler(req: Request, res: Response) {
  try {
    const hasEvents = await getDataRepo().hasAnyEvents();

    res.json({
      hasEvents,
      allowedOrigin: config.ALLOWED_ORIGIN,
      apiBaseUrl: config.API_BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function healthCheckHandler(req: Request, res: Response) {
  try {
    await getDataRepo().hasAnyEvents();
    res.status(200).json({ healthy: true });
  } catch (err) {
    console.error(err);
    res.status(503).json({ healthy: false });
  }
}

export async function getHeadersHandler(req: Request, res: Response) {
  try {
    console.log(req.headers);
    res.json(req.headers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
