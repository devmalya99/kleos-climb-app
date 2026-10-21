import { api } from "@/services/api";

import type {
  Task,
  TaskCreateInput,
  TaskResponse,
  TaskUpdateInput,
  TasksResponse,
} from "../types/taskManager.types";

const base = "/api/brain-clutter/tasks";

export async function listTasksApi(categoryId: string): Promise<Task[]> {
  const data = await api.get<TasksResponse>(`${base}/categories/${categoryId}/tasks`);
  return data.tasks;
}

export async function createTaskApi(input: TaskCreateInput): Promise<Task> {
  const data = await api.post<TaskResponse>(base, input);
  return data.task;
}

export async function updateTaskApi(
  taskId: string,
  input: TaskUpdateInput,
): Promise<Task> {
  const data = await api.patch<TaskResponse>(`${base}/${taskId}`, input);
  return data.task;
}

export async function deleteTaskApi(taskId: string): Promise<void> {
  await api.delete(`${base}/${taskId}`);
}
