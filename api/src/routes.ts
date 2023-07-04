import { Request, Response } from "express";
import {
  createEvent,
  getHitsPerPage,
  getSessionsPerDay,
  getStats,
  getTopReferrers,
  getUniqueSessionsByCountry,
  getUniqueSessionsPerPage,
} from "./services/service";
import { getAnalyticsCode } from "./utils/analyticScript";
import { extractEvent } from "./utils/extractEvent";
import { EventCreateRequest } from "./types/models";

export async function handleCreateEvent(req: Request<{}, {}, EventCreateRequest>, res: Response) {
  try {
    const event = extractEvent(req);
    await createEvent(event);
    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEventHandler(req: Request, res: Response) {
  try {
    const event = extractEvent(req);
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getSessionsPerDayHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getSessionsPerDay(Number(days) || 7);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getStatsHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getStats(Number(days) || 7);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getHitsPerPageHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getHitsPerPage(Number(days) || 7);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUniqueSessionsPerPageHandler = async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const result = await getUniqueSessionsPerPage(Number(days) || 7);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUniqueSessionsByCountryHandler = async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const result = await getUniqueSessionsByCountry(Number(days) || 7);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function getTopReferrersHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getTopReferrers(Number(days) || 7);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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

export async function getJsFileHandler(req: Request, res: Response) {
  const fileContent = await getAnalyticsCode();
  res.setHeader("Content-Type", "application/javascript");
  res.end(fileContent);
}
