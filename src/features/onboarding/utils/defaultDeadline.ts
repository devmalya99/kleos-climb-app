import { DEFAULT_DEADLINE_DAYS } from "../constants/onboarding.constants";

/** Local calendar day, today plus 90, as YYYY-MM-DD. */
export function defaultDeadline(now = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setDate(date.getDate() + DEFAULT_DEADLINE_DAYS);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
