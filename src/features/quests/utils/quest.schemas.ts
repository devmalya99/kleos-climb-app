import { z } from "zod";

import {
  QUEST_DESCRIPTION_MAX,
  QUEST_NAME_MAX,
} from "../constants/quests.constants";

export const questFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Quest name is required")
    .max(QUEST_NAME_MAX, `Keep it under ${QUEST_NAME_MAX} characters`),
  description: z
    .string()
    .trim()
    .max(QUEST_DESCRIPTION_MAX, `Keep it under ${QUEST_DESCRIPTION_MAX} characters`),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  resources: z.array(z.url("Each resource must be a valid URL")),
});

/** One resource URL per line; blank lines ignored. */
export function parseResourcesText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
