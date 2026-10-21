import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";

import {
  createCategoryApi,
  deleteCategoryApi,
  listCategoriesApi,
  renameCategoryApi,
} from "../api/categories.api";
import { TASK_QUERY_KEYS } from "../constants/taskManager.constants";
import type { TaskCategory } from "../types/taskManager.types";

/** Category list, the active selection, and soft-locked category CRUD. */
export function useTaskCategories() {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: TASK_QUERY_KEYS.categories,
    queryFn: listCategoriesApi,
  });

  const categories = query.data ?? [];
  const activeCategory =
    categories.find((category) => category.id === selectedId) ?? categories[0] ?? null;

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });

  const create = useMutation({ mutationFn: createCategoryApi, onSuccess: refresh });
  const rename = useMutation({
    mutationFn: (vars: { categoryId: string; name: string }) =>
      renameCategoryApi(vars.categoryId, vars.name),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: deleteCategoryApi, onSuccess: refresh });

  async function createCategory(name: string) {
    const result = await run(() => create.mutateAsync(name), "Could not create the category");
    if (result.ok) setSelectedId(result.value.id);
    return result;
  }

  function renameCategory(categoryId: string, name: string) {
    return run(
      () => rename.mutateAsync({ categoryId, name }),
      "Could not rename the category",
    );
  }

  function deleteCategory(category: TaskCategory) {
    confirmAction(
      {
        title: "Delete category?",
        message: `"${category.name}" and its ${category.taskCount} task(s) will be removed.`,
      },
      () =>
        void run(() => remove.mutateAsync(category.id), "Could not delete the category").then(
          (result) => {
            if (result.ok) setSelectedId(null);
          },
        ),
    );
  }

  return {
    categories,
    activeCategory,
    selectCategory: setSelectedId,
    isLoading: query.isLoading,
    loadError: query.error,
    refetch: query.refetch,
    isSaving: create.isPending || rename.isPending || remove.isPending,
    error,
    clearError,
    createCategory,
    renameCategory,
    deleteCategory,
  };
}
