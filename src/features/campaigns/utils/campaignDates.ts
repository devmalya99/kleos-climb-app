import { MS_PER_DAY } from "../constants/campaigns.constants";

/** Server stores the target at 23:59:59.999 UTC of the chosen day, so the UTC date is the picked date. */
export function toDateOnly(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function formatTargetDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Whole calendar days from `now` (local date) to the target date. Negative when past. */
export function daysUntil(isoDate: string, now: Date = new Date()): number {
  const [year, month, day] = toDateOnly(isoDate).split("-").map(Number);
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / MS_PER_DAY);
}

export function describeDaysLeft(days: number): string {
  if (days < 0) return "Date passed";
  if (days === 0) return "Today";
  return `${days} ${days === 1 ? "day" : "days"} left`;
}
