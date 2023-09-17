import { UserAgentQueryKeys } from "@shared/types";

export function isUserAgentQueryKey(key: any): key is UserAgentQueryKeys {
  if (typeof key !== "string") false;
  if (!["client_type", "client_name", "device_type", "device_brand", "os_name"].includes(key)) {
    return false;
  }

  return true;
}
