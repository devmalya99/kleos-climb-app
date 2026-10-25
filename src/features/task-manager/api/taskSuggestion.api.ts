import { z } from "zod";

import { api } from "@/services/api";
import { ApiError } from "@/services/api/errors";

import type { SuggestedTask } from "../types/taskManager.types";

const SUGGESTION_PATH = "/api/brain-clutter/tasks/suggestion";

const suggestedTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
});

const suggestionResponseSchema = z.object({
  task: suggestedTaskSchema.nullable(),
});

/** One unfinished task, or null when the account has none. Invalid JSON throws. */
export async function fetchSuggestedTask(excludeTaskId?: string): Promise<SuggestedTask | null> {
  const exclude = excludeTaskId ?? "";
  const path = exclude
    ? `${SUGGESTION_PATH}?exclude=${encodeURIComponent(exclude)}`
    : SUGGESTION_PATH;
  const data = await api.get<unknown>(path);
  const parsed = suggestionResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Invalid task suggestion", 500);
  }
  return parsed.data.task;
}
