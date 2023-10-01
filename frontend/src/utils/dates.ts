import { DateTime } from "luxon";

export function formatDate(date: Date | string | number) {
  return DateTime.fromISO(date.toString()).toLocaleString(DateTime.DATETIME_SHORT);
}
