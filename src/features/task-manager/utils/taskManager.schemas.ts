import { z } from "zod";

import {
  CATEGORY_NAME_MAX,
  EXPAND_CONTENT_MAX,
  TASK_NOTES_MAX,
  TASK_TITLE_MAX,
  TIMER_MAX_MINUTES,
  TIMER_MIN_MINUTES,
} from "../constants/taskManager.constants";

export const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(CATEGORY_NAME_MAX, `Keep it under ${CATEGORY_NAME_MAX} characters`);

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(TASK_TITLE_MAX, `Keep it under ${TASK_TITLE_MAX} characters`),
  notes: z.string().max(TASK_NOTES_MAX, `Keep notes under ${TASK_NOTES_MAX} characters`),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const expandContentSchema = z
  .string()
  .trim()
  .min(1, "Paste something to expand into tasks")
  .max(EXPAND_CONTENT_MAX, `Keep it under ${EXPAND_CONTENT_MAX} characters`);

export const timerMinutesSchema = z
  .number()
  .int("Use whole minutes")
  .min(TIMER_MIN_MINUTES, `Minimum is ${TIMER_MIN_MINUTES} minute`)
  .max(TIMER_MAX_MINUTES, `Maximum is ${TIMER_MAX_MINUTES} minutes`);
