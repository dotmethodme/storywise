import { Request, Response } from "express";
import { getAnalyticsCode } from "./utils/analyticScript";
import { extractEvent } from "./utils/extractEvent";
import { EventCreateRequest } from "./types/models";
import { config } from "./utils/config";
import { getDataRepo } from "./repository/repo";
import { UserAgentQueryKeys } from "@shared/types";
import { isUserAgentQueryKey } from "./utils/guards";

export async function handleCreateEvent(req: Request<{}, {}, EventCreateRequest>, res: Response) {
  try {
    const event = extractEvent(req);
    await getDataRepo().createEvent(event);
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
    const result = await getDataRepo().getSessionsPerDay(Number(days) || 30);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getStatsHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getDataRepo().getStats(Number(days) || 30);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getHitsPerPageHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getDataRepo().getHitsPerPage(Number(days) || 30);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUniqueSessionsPerPageHandler = async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const result = await getDataRepo().getUniqueSessionsPerPage(Number(days) || 30);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUniqueSessionsByCountryHandler = async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const result = await getDataRepo().getUniqueSessionsByCountry(Number(days) || 30);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function getTopReferrersHandler(req: Request, res: Response) {
  try {
    const { days } = req.query;
    const result = await getDataRepo().getTopReferrers(Number(days) || 30);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCountSessionsByUserAgentHandler(
  req: Request<unknown, unknown, { key: UserAgentQueryKeys }>,
  res: Response
) {
  try {
    const { key, days } = req.query;
    if (!isUserAgentQueryKey(key)) {
      throw new Error("Invalid key");
    }

    const result = await getDataRepo().getSessionCountByUserAgent(key, Number(days) || 30);
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

export async function siteConfig(req: Request, res: Response) {
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
