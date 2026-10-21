import { api } from "@/services/api";

import type {
  ClutterNote,
  NoteCreateInput,
  NoteDraft,
  NoteResponse,
  NoteUpdateInput,
  PendingNoteTask,
  PendingTasksResponse,
  RewriteResult,
} from "../types/brainClutter.types";

const base = "/api/brain-clutter";

export async function createNoteApi(input: NoteCreateInput): Promise<ClutterNote> {
  const data = await api.post<NoteResponse>(`${base}/notes`, input);
  return data.note;
}

export async function updateNoteApi(
  noteId: string,
  input: NoteUpdateInput,
): Promise<ClutterNote> {
  const data = await api.patch<NoteResponse>(`${base}/notes/${noteId}`, input);
  return data.note;
}

export async function deleteNoteApi(noteId: string): Promise<void> {
  await api.delete(`${base}/notes/${noteId}`);
}

/** AI preview only: the server returns text and never writes the note. */
export async function rewriteNoteApi(draft: NoteDraft): Promise<RewriteResult> {
  return api.post<RewriteResult>(`${base}/notes/rewrite`, draft);
}

export async function listPendingTasksApi(): Promise<PendingNoteTask[]> {
  const data = await api.get<PendingTasksResponse>(`${base}/pending-tasks`);
  return data.tasks;
}
