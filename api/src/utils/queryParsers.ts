import { Request } from "express";

export function parseDays(req: Request): number {
  const { days } = req.query;
  if (days && typeof days === "string" && !isNaN(parseInt(days))) {
    return parseInt(days);
  }

  return 30;
}

export function parseAppId(req: Request): string {
  const { app_id } = req.query;
  if (app_id && typeof app_id === "string") {
    return app_id;
  }

  throw new Error("Invalid app_id");
}
