import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";

import { getGroupApi } from "../api/groups.api";
import { createNoteApi, deleteNoteApi, updateNoteApi } from "../api/notes.api";
import { CLUTTER_QUERY_KEYS } from "../constants/brainClutter.constants";
import type { ClutterNote, NoteUpdateInput } from "../types/brainClutter.types";
import type { NoteFormValues } from "../utils/clutter.schemas";

/** One bucket with its notes: create, edit, complete-toggle and delete. */
export function useClutterGroupDetail(groupId: string) {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();

  const detailQuery = useQuery({
    queryKey: CLUTTER_QUERY_KEYS.group(groupId),
    queryFn: () => getGroupApi(groupId),
    enabled: Boolean(groupId),
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: CLUTTER_QUERY_KEYS.all });

  const create = useMutation({
    mutationFn: (values: NoteFormValues) => createNoteApi({ groupId, ...values }),
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: (vars: { noteId: string; input: NoteUpdateInput }) =>
      updateNoteApi(vars.noteId, vars.input),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: deleteNoteApi, onSuccess: refresh });

  function createNote(values: NoteFormValues) {
    return run(() => create.mutateAsync(values), "Could not save the note");
  }

  function saveNote(noteId: string, values: NoteFormValues) {
    return run(
      () => update.mutateAsync({ noteId, input: values }),
      "Could not save the note",
    );
  }

  function toggleCompleted(note: ClutterNote) {
    return run(
      () =>
        update.mutateAsync({
          noteId: note.id,
          input: { isCompleted: !note.isCompleted },
        }),
      "Could not update the note",
    );
  }

  function deleteNote(note: ClutterNote, onDeleted?: () => void) {
    confirmAction(
      { title: "Delete note?", message: `"${note.title}" will be removed.` },
      () =>
        void run(() => remove.mutateAsync(note.id), "Could not delete the note").then(
          (result) => {
            if (result.ok) onDeleted?.();
          },
        ),
    );
  }

  return {
    group: detailQuery.data?.group ?? null,
    notes: detailQuery.data?.notes ?? [],
    isLoading: detailQuery.isLoading,
    loadError: detailQuery.error,
    refetch: detailQuery.refetch,
    isSaving: create.isPending || update.isPending || remove.isPending,
    error,
    clearError,
    createNote,
    saveNote,
    toggleCompleted,
    deleteNote,
  };
}
