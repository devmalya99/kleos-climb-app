import { api } from "@/services/api";

import type {
  ExportNoteResponse,
  RagSession,
  SessionResponse,
} from "../types/ragQuiz.types";

const base = "/api/rag-quiz/sessions";

export async function startSessionApi(packId: string): Promise<RagSession> {
  const data = await api.post<SessionResponse>(base, { packId });
  return data.session;
}

export async function getSessionApi(sessionId: string): Promise<RagSession> {
  const data = await api.get<SessionResponse>(`${base}/${sessionId}`);
  return data.session;
}

export async function nextQuestionApi(sessionId: string): Promise<RagSession> {
  const data = await api.post<SessionResponse>(`${base}/${sessionId}/next`);
  return data.session;
}

export async function answerQuestionApi(
  sessionId: string,
  itemId: string,
  answerIndex: number,
): Promise<RagSession> {
  const data = await api.post<SessionResponse>(`${base}/${sessionId}/answer`, {
    itemId,
    answerIndex,
  });
  return data.session;
}

export async function extendSessionApi(sessionId: string): Promise<RagSession> {
  const data = await api.post<SessionResponse>(`${base}/${sessionId}/extend`);
  return data.session;
}

export async function reportSessionApi(sessionId: string): Promise<RagSession> {
  const data = await api.post<SessionResponse>(`${base}/${sessionId}/report`);
  return data.session;
}

/** Saves the report as a note in the "RAG Quiz" Brain Clutter bucket. */
export async function exportNoteApi(sessionId: string): Promise<string> {
  const data = await api.post<ExportNoteResponse>(`${base}/${sessionId}/export-note`);
  return data.noteId;
}
