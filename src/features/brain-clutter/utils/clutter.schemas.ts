import { z } from "zod";

import {
  GROUP_NAME_MAX,
  NOTE_CONTENT_MAX,
  NOTE_TITLE_MAX,
} from "../constants/brainClutter.constants";

export const groupNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(GROUP_NAME_MAX, `Keep it under ${GROUP_NAME_MAX} characters`);

export const noteFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(NOTE_TITLE_MAX, `Keep it under ${NOTE_TITLE_MAX} characters`),
  content: z.string().max(NOTE_CONTENT_MAX, "This note is too long"),
  isTask: z.boolean(),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
