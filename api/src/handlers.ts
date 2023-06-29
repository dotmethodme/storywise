import { Request, Response } from "express";
import { WebEvent } from "./types/models";
import {
  createEvent,
  enrichEvent,
  getAnalyticsCode,
  getHitsPerPage,
  getSessionsPerDay,
  getTopReferrers,
  getUniqueSessionsPerPage,
} from "./service";

export async function handleCreateEvent(req: Request, res: Response) {
  try {
    const { body } = req;
    const event: WebEvent = {
      session_id: req.fingerprint?.hash!,
      path: body.path,
      referrer: body.referrer,
    };
    enrichEvent(event, req);
    await createEvent(event);
    res.json({ message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getEventHandler(req: Request, res: Response) {
  try {
    const event: WebEvent = {
      session_id: "test",
      path: "/test",
    };
    enrichEvent(event, req);
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
