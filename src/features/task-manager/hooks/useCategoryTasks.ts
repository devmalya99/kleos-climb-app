import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";

import {
  createTaskApi,
  deleteTaskApi,
  listTasksApi,
  updateTaskApi,
} from "../api/tasks.api";
import { TASK_QUERY_KEYS } from "../constants/taskManager.constants";
import type { Task, TaskUpdateInput } from "../types/taskManager.types";
import { sortTasksForDisplay } from "../utils/taskList";
import type { TaskFormValues } from "../utils/taskManager.schemas";

/** Tasks of one category: create, edit, toggle done and delete. */
export function useCategoryTasks(categoryId: string | null) {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();

  const query = useQuery({
    queryKey: TASK_QUERY_KEYS.tasks(categoryId ?? ""),
    queryFn: () => listTasksApi(categoryId ?? ""),
    enabled: Boolean(categoryId),
  });

  // Category counters also change when tasks change.
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all });

  const create = useMutation({
    mutationFn: (values: TaskFormValues) =>
      createTaskApi({ categoryId: categoryId ?? "", ...values }),
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: (vars: { taskId: string; input: TaskUpdateInput }) =>
      updateTaskApi(vars.taskId, vars.input),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: deleteTaskApi, onSuccess: refresh });

  function createTask(values: TaskFormValues) {
    return run(() => create.mutateAsync(values), "Could not add the task");
  }

  function saveTask(taskId: string, values: TaskFormValues) {
    return run(
      () => update.mutateAsync({ taskId, input: values }),
      "Could not save the task",
    );
  }

  function toggleTask(task: Task) {
    return run(
      () =>
        update.mutateAsync({ taskId: task.id, input: { isCompleted: !task.isCompleted } }),
      "Could not update the task",
    );
  }

  function deleteTask(task: Task) {
    confirmAction(
      { title: "Delete task?", message: `"${task.title}" will be removed.` },
      () => void run(() => remove.mutateAsync(task.id), "Could not delete the task"),
    );
  }

  return {
    tasks: sortTasksForDisplay(query.data ?? []),
    isLoading: query.isLoading,
    loadError: query.error,
    refetch: query.refetch,
    isSaving: create.isPending || update.isPending || remove.isPending,
    error,
    clearError,
    createTask,
    saveTask,
    toggleTask,
    deleteTask,
  };
}
