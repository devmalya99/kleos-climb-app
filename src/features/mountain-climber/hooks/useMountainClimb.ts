import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";
import { logger } from "@/services/logging/logger";

import {
  applyClimbActionApi,
  deleteClimbApi,
  getClimbBoard,
  startClimbApi,
} from "../api/climb.api";
import {
  CLIMB_QUERY_KEY,
  LEVEL_CAP_MESSAGE,
  MAX_LEVELS,
  MAX_SUMMITS,
  SELECTED_SUMMIT_KEY,
  SUMMIT_CAP_MESSAGE,
} from "../constants/climb.constants";
import type { ClimbBoard } from "../types/climb.types";
import { applyClimbAction, getClimbStats } from "../utils/climb-path";
import type { ClimbAction, ClimbSetupInput } from "../utils/climb.schemas";

const actionMutationKey = [...CLIMB_QUERY_KEY, "action"] as const;

function rememberSummit(id: string | null) {
  const write = id
    ? AsyncStorage.setItem(SELECTED_SUMMIT_KEY, id)
    : AsyncStorage.removeItem(SELECTED_SUMMIT_KEY);
  void write.catch((error: unknown) => {
    logger.warn("Could not remember the open summit", { error });
  });
}

function withAction(board: ClimbBoard, action: ClimbAction): ClimbBoard {
  if (!board.climb) return board;
  const climb = applyClimbAction(board.climb, action, new Date(), () => Crypto.randomUUID());
  const stats = getClimbStats(climb, new Date());
  return {
    climb,
    sessions: board.sessions.map((session) =>
      session.id === climb.id
        ? { ...session, clearedLevels: stats.clearedLevels, totalLevels: stats.totalLevels }
        : session,
    ),
  };
}

export function useMountainClimb() {
  const queryClient = useQueryClient();
  const { error, run, clearError, fail } = useSoftAction();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(SELECTED_SUMMIT_KEY)
      .then((stored) => {
        if (cancelled) return;
        setSelectedId(stored);
        setReady(true);
      })
      .catch((storageError: unknown) => {
        logger.warn("Could not read the open summit", { error: storageError });
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const boardQuery = useQuery({
    queryKey: [...CLIMB_QUERY_KEY, selectedId],
    queryFn: () => getClimbBoard(selectedId),
    enabled: ready,
  });
  const board = boardQuery.data;
  const climb = board?.climb ?? null;

  // A stored id from a deleted summit falls back to the newest one the server returned.
  useEffect(() => {
    if (!board) return;
    const known = selectedId !== null && board.sessions.some((session) => session.id === selectedId);
    if (known) return;
    const nextId = board.climb?.id ?? null;
    if (nextId === selectedId) return;
    if (nextId) queryClient.setQueryData([...CLIMB_QUERY_KEY, nextId], board);
    setSelectedId(nextId);
    rememberSummit(nextId);
  }, [board, queryClient, selectedId]);

  function openSummit(id: string) {
    setSelectedId(id);
    rememberSummit(id);
    clearError();
  }

  function storeBoard(next: ClimbBoard) {
    const id = next.climb?.id ?? null;
    queryClient.setQueryData([...CLIMB_QUERY_KEY, id], next);
    setSelectedId(id);
    rememberSummit(id);
    void queryClient.invalidateQueries({ queryKey: CLIMB_QUERY_KEY });
  }

  const startMutation = useMutation({
    mutationFn: startClimbApi,
    onSuccess: (created) => storeBoard(created),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClimbApi,
    onSuccess: (next, climbId) => {
      queryClient.removeQueries({ queryKey: [...CLIMB_QUERY_KEY, climbId] });
      storeBoard(next);
    },
  });

  const actionMutation = useMutation({
    mutationKey: actionMutationKey,
    mutationFn: ({ climbId, action }: { climbId: string; action: ClimbAction }) =>
      applyClimbActionApi(climbId, action),
    onMutate: async ({ climbId, action }) => {
      const key = [...CLIMB_QUERY_KEY, climbId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ClimbBoard>(key);
      if (previous) queryClient.setQueryData(key, withAction(previous, action));
      return { previous, key };
    },
    onError: (_error, _command, context) => {
      if (context) queryClient.setQueryData(context.key, context.previous);
    },
    onSuccess: (saved, command) => {
      if (queryClient.isMutating({ mutationKey: actionMutationKey }) === 1) {
        queryClient.setQueryData([...CLIMB_QUERY_KEY, command.climbId], saved);
      }
    },
  });

  function runAction(action: ClimbAction) {
    if (!climb) return Promise.resolve({ ok: false as const });
    return run(
      () => actionMutation.mutateAsync({ climbId: climb.id, action }),
      "Could not update the climb",
    );
  }

  function startClimb(input: ClimbSetupInput) {
    return run(() => startMutation.mutateAsync(input), "Could not start the climb");
  }

  function requestNewSummit(): boolean {
    const count = board?.sessions.length ?? 0;
    if (count >= MAX_SUMMITS) {
      fail(SUMMIT_CAP_MESSAGE);
      return false;
    }
    clearError();
    return true;
  }

  function deleteSummit() {
    if (!climb) return;
    const climbId = climb.id;
    confirmAction(
      {
        title: "Delete this summit?",
        message: "This trail and its tasks will be erased. Your other summits stay.",
        confirmLabel: "Delete summit",
      },
      () => {
        void run(() => deleteMutation.mutateAsync(climbId), "Could not delete the summit");
      },
    );
  }

  return {
    climb,
    sessions: board?.sessions ?? [],
    isLoading: !ready || boardQuery.isPending,
    isRefreshing: boardQuery.isRefetching,
    loadError: boardQuery.error,
    retryLoad: () => boardQuery.refetch(),
    isStarting: startMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error,
    clearError,
    startClimb,
    requestNewSummit,
    openSummit,
    deleteSummit,
    addTrailLevel: (title: string, description: string) => {
      if (climb && climb.levels.length >= MAX_LEVELS) {
        fail(LEVEL_CAP_MESSAGE);
        return;
      }
      return runAction({ type: "add", title, description });
    },
    clearLevel: () => runAction({ type: "clear" }),
    undoClear: () => runAction({ type: "undo" }),
    removeLevel: (levelId: string) => runAction({ type: "remove", levelId }),
    editLevel: (levelId: string, title: string, description: string) =>
      runAction({ type: "edit", levelId, title, description }),
    setLevelProgress: (levelId: string, progress: number) =>
      runAction({ type: "setProgress", levelId, progress }),
    moveLevel: (activeId: string, overId: string) =>
      runAction({ type: "move", activeId, overId }),
  };
}
