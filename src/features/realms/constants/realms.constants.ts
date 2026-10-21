import type { Href } from "expo-router";

export const REALM_QUERY_KEYS = {
  list: (examId: string) => ["realms", examId] as const,
  analyserStatuses: (examId: string) => ["realm-analyser-statuses", examId] as const,
};

export const REALM_NAME_MAX = 64;
export const AUTOFILL_NOTES_MIN = 5;
export const AUTOFILL_NOTES_MAX = 4000;

/** Analyser, Colosseum and quiz screens ship in later features, so their hrefs are cast. */
export const realmHref = {
  detail: (examId: string, categoryId: string) =>
    `/realm/${examId}/${categoryId}` as const,
  autofill: (examId: string, categoryId: string) =>
    `/autofill/${examId}/${categoryId}` as const,
  analyser: (examId: string, categoryId: string) =>
    `/level-analyser/${examId}/${categoryId}` as Href,
  colosseum: (examId: string, categoryId: string) =>
    `/colosseum/${examId}/${categoryId}` as Href,
  questQuiz: (examId: string, topicId: string) =>
    `/quest-quiz/${examId}/${topicId}` as Href,
};
