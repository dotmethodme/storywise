import { WebEvent } from "../types/models";

export function undefinedValuesToNull<T>(obj: T): T {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === undefined) {
      // @ts-ignore
      newObj[key] = null;
    }
  }
  return newObj;
}

export function webEventToSqlFormat(event: WebEvent) {
  return undefinedValuesToNull({
    session_id: event.session_id,
    path: event.path,
    timestamp: event.timestamp.toISOString(),
    ip: event.ip || null,
    user_agent: event.user_agent || null,
    referrer: event.referrer || null,
    language: event.language || null,
    country: event.country || null,
    screen_width: event.screen_width || null,
    screen_height: event.screen_height || null,
    window_width: event.window_width || null,
    window_height: event.window_height || null,
    bot_name: event.bot_name || null,
    bot_category: event.bot_category || null,
    bot_url: event.bot_url || null,
    bot_producer_name: event.bot_producer_name || null,
    bot_producer_url: event.bot_producer_url || null,
    client_type: event.client_type || null,
    client_name: event.client_name || null,
    client_version: event.client_version || null,
    client_engine: event.client_engine || null,
    client_engine_version: event.client_engine_version || null,
    device_type: event.device_type || null,
    device_brand: event.device_brand || null,
    device_model: event.device_model || null,
    os_name: event.os_name || null,
    os_version: event.os_version || null,
    os_platform: event.os_platform || null,
    app_id: event.app_id || null,
    utm_source: event.utm_source || null,
    utm_medium: event.utm_medium || null,
    utm_campaign: event.utm_campaign || null,
    utm_term: event.utm_term || null,
    utm_content: event.utm_content || null,
  });
}
