import { useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { AiReorderSheet } from "@/shared/components/AiReorderSheet";

import { suggestClimbReorderApi } from "../api/climb.api";
import type { Climb } from "../types/climb.types";
import { isIdPermutation } from "../utils/climb-path";

type ClimbReorderSheetProps = {
  climb: Climb;
  onApply: (levelIds: string[]) => Promise<{ ok: true } | { ok: false; error: string }>;
  onClose: () => void;
};

/** Opens, asks for an order, and saves only when Apply is pressed. */
export function ClimbReorderSheet({ climb, onApply, onClose }: ClimbReorderSheetProps) {
  const climbRef = useRef(climb);
  climbRef.current = climb;
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [levelIds, setLevelIds] = useState<string[]>([]);
  const [rows, setRows] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    const current = climbRef.current;
    setLoading(true);
    setError(null);
    setReason(null);
    setRows([]);
    setLevelIds([]);

    void suggestClimbReorderApi(current.id)
      .then((suggestion) => {
        if (cancelled) return;
        const pending = current.levels
          .filter((level) => level.completedAt === null)
          .map((level) => level.id);
        if (!isIdPermutation(pending, suggestion.levelIds)) {
          setError("That order did not match your open tasks. Try again.");
          return;
        }
        const titles = new Map(current.levels.map((level) => [level.id, level.title]));
        setLevelIds([...suggestion.levelIds]);
        setReason(suggestion.reason);
        setRows(suggestion.levelIds.map((id) => ({ id, title: titles.get(id) ?? "" })));
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
  }, [attempt, climb.id]);

  async function apply() {
    setApplying(true);
    const result = await onApply(levelIds);
    setApplying(false);
    if (result.ok) {
      onClose();
      return;
    }
    setError(result.error);
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
