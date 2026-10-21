import { api } from "@/services/api";

import type {
  StartQuestQuizResult,
  SubmitQuestQuizInput,
  SubmitQuestQuizResult,
} from "../types/questQuiz.types";

const base = (examId: string, topicId: string) =>
  `/api/exams/${examId}/topics/${topicId}/quest-quiz`;

export function startQuestQuizApi(examId: string, topicId: string) {
  return api.post<StartQuestQuizResult>(`${base(examId, topicId)}/start`);
}

export function submitQuestQuizApi(
  examId: string,
  topicId: string,
  input: SubmitQuestQuizInput,
) {
  return api.post<SubmitQuestQuizResult>(`${base(examId, topicId)}/submit`, input);
}

/** Overall timer expired: server fails the attempt using whatever was answered. */
export function timeoutQuestQuizApi(
  examId: string,
  topicId: string,
  input: SubmitQuestQuizInput,
) {
  return api.post<SubmitQuestQuizResult>(`${base(examId, topicId)}/timeout`, input);
}
