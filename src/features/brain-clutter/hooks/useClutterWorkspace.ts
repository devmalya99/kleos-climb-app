import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";

import {
  createGroupApi,
  deleteGroupApi,
  listGroupsApi,
  updateGroupApi,
} from "../api/groups.api";
import { listPendingTasksApi } from "../api/notes.api";
import { CLUTTER_QUERY_KEYS } from "../constants/brainClutter.constants";
import type { ClutterGroup, GroupUpdateInput } from "../types/brainClutter.types";

/** Buckets list + stats + pending note-tasks, with soft-locked bucket actions. */
export function useClutterWorkspace() {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();

  const groupsQuery = useQuery({
    queryKey: CLUTTER_QUERY_KEYS.groups,
    queryFn: listGroupsApi,
  });
  const pendingQuery = useQuery({
    queryKey: CLUTTER_QUERY_KEYS.pending,
    queryFn: listPendingTasksApi,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: CLUTTER_QUERY_KEYS.all });

  const create = useMutation({ mutationFn: createGroupApi, onSuccess: refresh });
  const update = useMutation({
    mutationFn: (vars: { groupId: string; input: GroupUpdateInput }) =>
      updateGroupApi(vars.groupId, vars.input),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: deleteGroupApi, onSuccess: refresh });

  function createGroup(name: string) {
    return run(() => create.mutateAsync(name), "Could not create the bucket");
  }

  function renameGroup(groupId: string, name: string) {
    return run(
      () => update.mutateAsync({ groupId, input: { name } }),
      "Could not rename the bucket",
    );
  }

  /** Pin limit (3) is enforced by the server; its message is shown inline. */
  function togglePin(group: ClutterGroup) {
    return run(
      () => update.mutateAsync({ groupId: group.id, input: { pinned: !group.isPinned } }),
      "Could not update the pin",
    );
  }

  function deleteGroup(group: ClutterGroup) {
    confirmAction(
      {
        title: "Delete bucket?",
        message: `"${group.name}" and its ${group.noteCount} note(s) will be removed.`,
      },
      () => void run(() => remove.mutateAsync(group.id), "Could not delete the bucket"),
    );
  }

  return {
    groups: groupsQuery.data?.groups ?? [],
    stats: groupsQuery.data?.stats ?? null,
    pendingTasks: pendingQuery.data ?? [],
    isLoading: groupsQuery.isLoading,
    loadError: groupsQuery.error,
    refetch: groupsQuery.refetch,
    isSaving: create.isPending || update.isPending || remove.isPending,
    error,
    clearError,
    createGroup,
    renameGroup,
    togglePin,
    deleteGroup,
  };
}
