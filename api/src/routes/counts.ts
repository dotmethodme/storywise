import { UserAgentQueryKeys } from "@shared/types";
import { Request, Response } from "express";
import { getDataRepo } from "../repository/repo";
import { isUserAgentQueryKey, isUtmTagKey } from "../utils/guards";
import { parseDays, parseAppId } from "../utils/queryParsers";

export async function getSessionsPerDayHandler(req: Request, res: Response) {
  try {
    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);
    const result = await getDataRepo().getSessionsPerDay(appId, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getStatsHandler(req: Request, res: Response) {
  try {
    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getStats(appId, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getHitsPerPageHandler(req: Request, res: Response) {
  try {
    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getHitsPerPage(appId, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUniqueSessionsPerPageHandler = async (req: Request, res: Response) => {
  try {
    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getUniqueSessionsPerPage(appId, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUniqueSessionsByCountryHandler = async (req: Request, res: Response) => {
  try {
    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getUniqueSessionsByCountry(appId, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function getTopReferrersHandler(req: Request, res: Response) {
  try {
    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getTopReferrers(appId, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCountSessionsByUserAgentHandler(
  req: Request<any, any, { key: UserAgentQueryKeys }>,
  res: Response
) {
  try {
    const { key } = req.query;
    if (!isUserAgentQueryKey(key)) {
      throw new Error("Invalid key");
    }

    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getSessionCountByUserAgent(appId, key, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCountSessionsByUtmHandler(req: Request<any, any, { key: UserAgentQueryKeys }>, res: Response) {
  try {
    const { key } = req.query;
    if (!isUtmTagKey(key)) {
      throw new Error("Invalid key. Must be one of utm_source, utm_medium, utm_campaign, utm_term, utm_content");
    }

    const numberOfDays = parseDays(req);
    const appId = parseAppId(req);

    const result = await getDataRepo().getSessionCountByUtmTag(appId, key, numberOfDays);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
