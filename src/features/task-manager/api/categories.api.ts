import { api } from "@/services/api";

import type {
  CategoriesResponse,
  CategoryResponse,
  TaskCategory,
} from "../types/taskManager.types";

const base = "/api/brain-clutter/tasks/categories";

export async function listCategoriesApi(): Promise<TaskCategory[]> {
  const data = await api.get<CategoriesResponse>(base);
  return data.categories;
}

export async function createCategoryApi(name: string): Promise<TaskCategory> {
  const data = await api.post<CategoryResponse>(base, { name });
  return data.category;
}

export async function renameCategoryApi(
  categoryId: string,
  name: string,
): Promise<TaskCategory> {
  const data = await api.patch<CategoryResponse>(`${base}/${categoryId}`, { name });
  return data.category;
}

export async function deleteCategoryApi(categoryId: string): Promise<void> {
  await api.delete(`${base}/${categoryId}`);
}
