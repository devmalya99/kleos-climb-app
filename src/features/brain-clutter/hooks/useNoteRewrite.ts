import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";

import { rewriteNoteApi } from "../api/notes.api";
import type { NoteDraft, RewriteResult } from "../types/brainClutter.types";

/**
 * AI rewrite is a two-step flow: `requestRewrite` only fetches a preview,
 * the editor decides whether to apply it. Nothing is persisted here.
 */
export function useNoteRewrite() {
  const { error, run, clearError } = useSoftAction();
  const [preview, setPreview] = useState<RewriteResult | null>(null);
  const mutation = useMutation({ mutationFn: rewriteNoteApi });

  async function requestRewrite(draft: NoteDraft) {
    const result = await run(
      () => mutation.mutateAsync(draft),
      "Could not rewrite this note",
    );
    if (result.ok) setPreview(result.value);
  }

  function discard() {
    setPreview(null);
    clearError();
  }

  return {
    preview,
    isRewriting: mutation.isPending,
    error,
    requestRewrite,
    discard,
  };
}
