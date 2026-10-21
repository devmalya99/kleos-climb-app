import { api } from "@/services/api";

import type {
  ColosseumAnswerResult,
  ColosseumStatus,
  ColosseumStatusResponse,
  StartColosseumResult,
} from "../types/colosseum.types";

const base = (examId: string, categoryId: string) =>
  `/api/exams/${examId}/categories/${categoryId}/colosseum`;

export async function getColosseumStatusApi(
  examId: string,
  categoryId: string,
): Promise<ColosseumStatus> {
  const data = await api.get<ColosseumStatusResponse>(`${base(examId, categoryId)}/status`);
  return data.status;
}

export function startColosseumApi(examId: string, categoryId: string) {
  return api.post<StartColosseumResult>(`${base(examId, categoryId)}/start`);
}

export function answerColosseumApi(
  examId: string,
  categoryId: string,
  attemptId: string,
  selectedIndex: number,
) {
  return api.post<ColosseumAnswerResult>(`${base(examId, categoryId)}/answer`, {
    attemptId,
    selectedIndex,
  });
}

/** The per-question timer ran out; the server counts it as a wrong strike. */
export function timeoutColosseumApi(examId: string, categoryId: string, attemptId: string) {
  return api.post<ColosseumAnswerResult>(`${base(examId, categoryId)}/timeout`, { attemptId });
}

export function surrenderColosseumApi(examId: string, categoryId: string, attemptId: string) {
  return api.post<ColosseumAnswerResult>(`${base(examId, categoryId)}/surrender`, { attemptId });
}
