import { Request } from "express";
import UAParser from "ua-parser-js";
import { WebEvent } from "../types/models";

export function extractEvent(request: Request): WebEvent {
  const event: WebEvent = {
    session_id: request.body.session_id,
    path: request.body.path,
    referrer: request.body.referrer,
    screen: request.body.screen,
    window: request.body.window,
  };

  event.timestamp = new Date();
  event.user_agent = request.headers["user-agent"] as string | null;
  event.language = request.headers["accept-language"] as string | null;
  event.country = request.headers["cf-ipcountry"] as string | null;
  event.ip = getIpFromRequest(request);

  if (event.user_agent) {
    let parser = new UAParser(event.user_agent);
    const user_agent = parser.getResult();

    event.user_agent_enriched = user_agent;
  }

  return event;
}

function getIpFromRequest(req: Request) {
  let ip = req.headers["cf-connecting-ip"] as string;
  if (ip) return ip;

  ip = req.headers["x-real-ip"] as string;
  if (ip) return ip;

  ip = req.headers["x-forwarded-for"] as string;
  if (ip) return ip;

  return req.ip;
}
