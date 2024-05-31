import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function getDaysAgo(days: number): Date {
  return dayjs().utc().subtract(days, "day").hour(0).minute(0).second(0).millisecond(0).toDate();
}

export function getDaysAgoString(days: number): string {
  return dayjs().utc().subtract(days, "day").hour(0).minute(0).second(0).millisecond(0).toISOString();
}

export function getDaysAgoRandomTime(days: number) {
  const date = getDaysAgo(days);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  date.setMilliseconds(Math.floor(Math.random() * 1000));
  return date;
}
