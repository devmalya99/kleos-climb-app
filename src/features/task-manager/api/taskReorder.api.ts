import { z } from "zod";

import { ApiError, api } from "@/services/api";

import type { Task, TasksResponse } from "../types/taskManager.types";

const base = "/api/brain-clutter/tasks";

const suggestionSchema = z.object({
  taskIds: z.array(z.string().min(1)),
  reason: z.string(),
  tasks: z.array(z.object({ id: z.string(), title: z.string() })),
});

export type TaskReorderSuggestion = z.infer<typeof suggestionSchema>;

export async function suggestTaskReorderApi(categoryId: string): Promise<TaskReorderSuggestion> {
  const data = await api.post<unknown>(`${base}/reorder`, { categoryId });
  const parsed = suggestionSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Could not read the suggestion. Try again.", 422);
  }
  return parsed.data;
}

export async function applyTaskReorderApi(categoryId: string, taskIds: string[]): Promise<Task[]> {
  const data = await api.post<TasksResponse>(`${base}/reorder/apply`, { categoryId, taskIds });
  return data.tasks;
}
