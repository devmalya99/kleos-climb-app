import { useCallback, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";

export type ActionResult<T> = { ok: true; value: T } | { ok: false };

/**
 * "Soft-lock" error handling: a failed action never throws into the UI.
 * The message is kept in state so the screen can show it inline and stay usable.
 */
export function useSoftAction() {
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T>(action: () => Promise<T>, fallback: string): Promise<ActionResult<T>> => {
      setError(null);
      try {
        return { ok: true, value: await action() };
      } catch (err) {
        logger.warn(fallback, { message: getErrorMessage(err) });
        setError(getErrorMessage(err, fallback));
        return { ok: false };
      }
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  /** Show a validation message without running an action. */
  const fail = useCallback((message: string) => setError(message), []);

  return { error, run, clearError, fail };
}
