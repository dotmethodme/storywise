import { OperatingSystemResult } from "device-detector-js/dist/parsers/operating-system";
import { GenericDeviceResult } from "device-detector-js/dist/typings/device";

export type EventCreateRequest = {
  path: string;
  referrer?: string;
  session_id?: string;
};

export type WebEvent = {
  session_id: string;
  path: string;
  timestamp: Date;
  ip?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  language?: string | null;
  country?: string | null;
  screen_width?: number | undefined;
  screen_height?: number | undefined;
  window_width?: number | undefined;
  window_height?: number | undefined;
} & EventClientDetails;

export type EventClientDetails = {
  bot_name?: string | undefined;
  bot_category?: string | undefined;
  bot_url?: string | undefined;
  bot_producer_name?: string | undefined;
  bot_producer_url?: string | undefined;
  client_type?: string | undefined;
  client_name?: string | undefined;
  client_version?: string | undefined;
  client_engine?: string | undefined;
  client_engine_version?: string | undefined;
  device_type?: GenericDeviceResult["type"] | undefined;
  device_brand?: string | undefined;
  device_model?: string | undefined;
  os_name?: string | undefined;
  os_version?: string | undefined;
  os_platform?: OperatingSystemResult["platform"] | undefined;
};
