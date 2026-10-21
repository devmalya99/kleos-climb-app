import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";

import { applyReviewApi, reviewTasksApi } from "../api/taskAi.api";
import { TASK_QUERY_KEYS } from "../constants/taskManager.constants";
import type { ReviewItem } from "../types/taskManager.types";
import { buildReplacements, getSplittableItems } from "../utils/taskList";

/** Review → preview of suggested splits (nothing saved) → apply the selected ones. */
export function useReviewTasks(categoryId: string) {
  const queryClient = useQueryClient();
  const { error, run } = useSoftAction();
  const [items, setItems] = useState<ReviewItem[] | null>(null);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const reviewMutation = useMutation({
    mutationFn: () => reviewTasksApi(categoryId),
  });
  const applyMutation = useMutation({
    mutationFn: (replacements: ReturnType<typeof buildReplacements>) =>
      applyReviewApi(categoryId, replacements),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all }),
  });

  async function startReview() {
    const result = await run(() => reviewMutation.mutateAsync(), "Could not review the tasks");
    if (!result.ok) return;
    setItems(result.value);
    // Every actionable split starts selected; the user opts out per task.
    setSelected(new Set(getSplittableItems(result.value).map((item) => item.taskId)));
  }

  function toggle(taskId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  /** Resolves true when the splits were saved so the sheet can close. */
  async function apply(): Promise<boolean> {
    if (!items) return false;
    const replacements = buildReplacements(items, selected);
    if (replacements.length === 0) return false;
    const result = await run(
      () => applyMutation.mutateAsync(replacements),
      "Could not apply the splits",
    );
    return result.ok;
  }

  return {
    items,
    selected,
    splittable: items ? getSplittableItems(items) : [],
    isReviewing: reviewMutation.isPending,
    isApplying: applyMutation.isPending,
    error,
    startReview,
    toggle,
    apply,
  };
}
