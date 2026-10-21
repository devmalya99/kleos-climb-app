import { z } from "zod";

import { TIMEZONE_MAX, XP_GOAL_MAX, XP_GOAL_MIN } from "../constants/settings.constants";

export function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function getDeviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function xpGoal(label: string) {
  return z
    .string()
    .trim()
    .regex(/^\d+$/, `${label} must be a whole number`)
    .transform(Number)
    .pipe(
      z
        .number()
        .min(XP_GOAL_MIN, `At least ${XP_GOAL_MIN} XP per day`)
        .max(XP_GOAL_MAX, `Maximum ${XP_GOAL_MAX} XP per day`),
    );
}

export const availabilityFormSchema = z.object({
  weekdayXpPerDay: xpGoal("Weekday goal"),
  weekendXpPerDay: xpGoal("Weekend goal"),
  timezone: z
    .string()
    .trim()
    .min(1, "Timezone is required")
    .max(TIMEZONE_MAX, `Keep it under ${TIMEZONE_MAX} characters`)
    .refine(isValidTimeZone, "Use an IANA timezone, e.g. Asia/Kolkata"),
});
