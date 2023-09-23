import { UserAgentQueryKeys } from "@shared/types";
import { Request, Response } from "express";
import { getDataRepo } from "../repository/repo";
import { isUserAgentQueryKey } from "../utils/guards";

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
