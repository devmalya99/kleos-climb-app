import { api } from "@/services/api";

import type {
  ExpandResponse,
  ProposedTask,
  ReviewItem,
  ReviewResponse,
  Task,
  TaskReplacement,
  TasksResponse,
} from "../types/taskManager.types";

const base = "/api/brain-clutter/tasks";

/** Preview only: the server returns proposals and writes nothing. */
export async function expandTasksApi(
  categoryId: string,
  content: string,
): Promise<ProposedTask[]> {
  const data = await api.post<ExpandResponse>(`${base}/expand`, { categoryId, content });
  return data.tasks;
}

/** Persists the proposals the user kept. */
export async function acceptExpandedTasksApi(
  categoryId: string,
  tasks: ProposedTask[],
): Promise<Task[]> {
  const data = await api.post<TasksResponse>(`${base}/expand/accept`, { categoryId, tasks });
  return data.tasks;
}

/** Preview only: flags vague or oversized tasks and suggests splits. */
export async function reviewTasksApi(categoryId: string): Promise<ReviewItem[]> {
  const data = await api.post<ReviewResponse>(`${base}/review`, { categoryId });
  return data.items;
}

/** Replaces each chosen task with its split titles. */
export async function applyReviewApi(
  categoryId: string,
  replacements: TaskReplacement[],
): Promise<Task[]> {
  const data = await api.post<TasksResponse>(`${base}/review/apply`, {
    categoryId,
    replacements,
  });
  return data.tasks;
}
