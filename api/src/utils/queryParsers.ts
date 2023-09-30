import { Request } from "express";

export function parseDays(req: Request): number {
  const { days } = req.query;
  if (days && typeof days === "string" && !isNaN(parseInt(days))) {
    return parseInt(days);
  }

  return 30;
}

export function parseAppId(req: Request): string {
  const { appId } = req.query;
  if (appId && typeof appId === "string") {
    return appId;
  }

  throw new Error("Invalid appId");
}
