import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { AiReorderSheet } from "@/shared/components/AiReorderSheet";

import { applyTaskReorderApi, suggestTaskReorderApi } from "../api/taskReorder.api";
import { TASK_QUERY_KEYS } from "../constants/taskManager.constants";
import type { Task } from "../types/taskManager.types";
import { openTaskOrder } from "../utils/reorder-open-tasks";

type TaskReorderSheetProps = {
  categoryId: string;
  tasks: Task[];
  onClose: () => void;
};

/** Suggestion for one category. Apply replaces that category's task list. */
export function TaskReorderSheet({ categoryId, tasks, onClose }: TaskReorderSheetProps) {
  const queryClient = useQueryClient();
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [taskIds, setTaskIds] = useState<string[]>([]);
  const [rows, setRows] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    const current = tasksRef.current;
    setLoading(true);
    setError(null);
    setReason(null);
    setRows([]);
    setTaskIds([]);

    void suggestTaskReorderApi(categoryId)
      .then((suggestion) => {
        if (cancelled) return;
        const ordered = openTaskOrder(current, suggestion.taskIds);
        if (!ordered) {
          setError("That order did not match your open tasks. Try again.");
          return;
        }
        const titles = new Map(current.map((task) => [task.id, task.title]));
        setTaskIds(ordered);
        setReason(suggestion.reason);
        setRows(ordered.map((id) => ({ id, title: titles.get(id) ?? "" })));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not suggest an order"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, categoryId]);

  async function apply() {
    const ordered = openTaskOrder(tasksRef.current, taskIds);
    if (!ordered) {
      setError("That order did not match your open tasks. Try again.");
      return;
    }
    setApplying(true);
    try {
      const next = await applyTaskReorderApi(categoryId, ordered);
      queryClient.setQueryData(TASK_QUERY_KEYS.tasks(categoryId), next);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Could not save the order"));
    } finally {
      setApplying(false);
    }
  }

  return (
    <AiReorderSheet
      loading={loading}
      applying={applying}
      error={error}
      reason={reason}
      tasks={rows}
      onApply={() => void apply()}
      onRetry={() => setAttempt((value) => value + 1)}
      onClose={onClose}
    />
  );
}
