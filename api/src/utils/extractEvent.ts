import DeviceDetector, { DeviceDetectorResult } from "device-detector-js";
import { Request } from "express";
import { EventClientDetails, WebEvent } from "../types/models";
import { createHash } from "crypto";

const deviceDetector = new DeviceDetector();

export function extractEvent(request: Request): WebEvent {
  let event: WebEvent = {
    session_id: extractSessionId(request),
    app_id: request.body.app_id,
    path: request.body.path,
    referrer: request.body.referrer || null,
    screen_width: request.body.screen_width || null,
    screen_height: request.body.screen_height || null,
    window_width: request.body.window_width || null,
    window_height: request.body.window_height || null,
    user_agent: (request.headers["user-agent"] as string | null) || null,
    language: (request.headers["accept-language"] as string | null) || null,
    country: (request.headers["cf-ipcountry"] as string | null) || null,
    utm_source: request.body.utm_source || null,
    utm_medium: request.body.utm_medium || null,
    utm_campaign: request.body.utm_campaign || null,
    utm_term: request.body.utm_term || null,
    utm_content: request.body.utm_content || null,
    timestamp: new Date(),
  };

  if (event.user_agent) {
    const uaResult = deviceDetector.parse(event.user_agent);
    Object.assign(event, uaParserToModel(uaResult));
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

export function uaParserToModel(uaResult: DeviceDetectorResult): EventClientDetails {
  const bot_name = uaResult.bot?.name || undefined;
  const bot_category = uaResult.bot?.category || undefined;
  const bot_url = uaResult.bot?.url || undefined;
  const bot_producer_name = uaResult.bot?.producer?.name || undefined;
  const bot_producer_url = uaResult.bot?.producer?.url || undefined;

  const client_type = uaResult.client?.type || undefined;
  const client_name = uaResult.client?.name || undefined;
  const client_version = uaResult.client?.version || undefined;

  let client_engine: string | undefined;
  let client_engine_version: string | undefined;
  if (uaResult.client && "engine" in uaResult.client) {
    client_engine = uaResult.client?.engine || undefined;
    client_engine_version = uaResult.client?.engineVersion || undefined;
  }

  const device_type = uaResult.device?.type || undefined;
  const device_brand = uaResult.device?.brand || undefined;
  const device_model = uaResult.device?.model || undefined;

  const os_name = uaResult.os?.name || undefined;
  const os_version = uaResult.os?.version || undefined;
  const os_platform = uaResult.os?.platform || undefined;

  let result: EventClientDetails = {
    bot_name,
    bot_category,
    bot_url,
    bot_producer_name,
    bot_producer_url,
    client_type,
    client_name,
    client_version,
    client_engine,
    client_engine_version,
    device_type,
    device_brand,
    device_model,
    os_name,
    os_version,
    os_platform,
  };

  for (let k in result) {
    const key = k as keyof typeof result;
    if (result[key] == "" || result[key] == undefined || result[key] == null) {
      delete result[key];
    }
  }

  return result;
}

function extractSessionId(request: Request): string {
  const ip = getIpFromRequest(request);
  const userAgent = request.headers["user-agent"] as string | null;
  const data = `${ip}${userAgent}`;
  return createHash("sha1").update(data).digest("base64");
}
