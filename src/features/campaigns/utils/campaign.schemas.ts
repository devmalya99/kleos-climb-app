import { z } from "zod";

import { CAMPAIGN_NAME_MAX, DATE_ONLY_PATTERN } from "../constants/campaigns.constants";

export const campaignFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Campaign name is required")
    .max(CAMPAIGN_NAME_MAX, `Keep it under ${CAMPAIGN_NAME_MAX} characters`),
  targetDate: z
    .string()
    .trim()
    .regex(DATE_ONLY_PATTERN, "Use YYYY-MM-DD")
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Enter a real date"),
});
