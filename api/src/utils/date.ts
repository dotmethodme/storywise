export function getDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function getDaysAgoRandomTime(days: number) {
  const date = getDaysAgo(days);
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  date.setMilliseconds(Math.floor(Math.random() * 1000));
  return date;
}
