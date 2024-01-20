import { UserAgentQueryKeys, UtmTagKey } from "@shared/types";

export function isUserAgentQueryKey(key: any): key is UserAgentQueryKeys {
  if (typeof key !== "string") false;
  if (!["client_type", "client_name", "device_type", "device_brand", "os_name"].includes(key)) {
    return false;
  }

  return true;
}

export function isUtmTagKey(key: any): key is UtmTagKey {
  if (typeof key !== "string") false;
  if (!["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].includes(key)) {
    return false;
  }

  return true;
}
