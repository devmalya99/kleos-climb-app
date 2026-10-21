import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";

import { acceptExpandedTasksApi, expandTasksApi } from "../api/taskAi.api";
import { TASK_QUERY_KEYS } from "../constants/taskManager.constants";
import type { ProposedTask } from "../types/taskManager.types";
import { expandContentSchema } from "../utils/taskManager.schemas";

/** Paste → preview (nothing saved) → accept. Only `accept` writes to the server. */
export function useExpandTasks(categoryId: string) {
  const queryClient = useQueryClient();
  const { error, run, clearError, fail } = useSoftAction();
  const [content, setContent] = useState("");
  const [proposals, setProposals] = useState<ProposedTask[] | null>(null);

  const previewMutation = useMutation({
    mutationFn: (text: string) => expandTasksApi(categoryId, text),
  });
  const acceptMutation = useMutation({
    mutationFn: (tasks: ProposedTask[]) => acceptExpandedTasksApi(categoryId, tasks),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all }),
  });

  async function preview() {
    const parsed = expandContentSchema.safeParse(content);
    if (!parsed.success) {
      fail(parsed.error.issues[0]?.message ?? "Invalid content");
      return;
    }
    const result = await run(
      () => previewMutation.mutateAsync(parsed.data),
      "Could not expand that into tasks",
    );
    if (result.ok) setProposals(result.value);
  }

  function removeProposal(index: number) {
    setProposals((current) => current?.filter((_, i) => i !== index) ?? null);
  }

  /** Resolves true when the tasks were saved so the sheet can close. */
  async function accept(): Promise<boolean> {
    if (!proposals || proposals.length === 0) return false;
    const result = await run(
      () => acceptMutation.mutateAsync(proposals),
      "Could not save the tasks",
    );
    return result.ok;
  }

  function backToEdit() {
    setProposals(null);
    clearError();
  }

  return {
    content,
    setContent,
    proposals,
    isPreviewing: previewMutation.isPending,
    isAccepting: acceptMutation.isPending,
    error,
    preview,
    removeProposal,
    accept,
    backToEdit,
  };
}
