import { api } from "@/services/api";

import type {
  ExamAnalytics,
  ExamAnalyticsResponse,
  UserProgressAnalytics,
} from "../types/battleStats.types";

/** 403 until Battle Stats is unlocked. */
export function getAnalyticsApi() {
  return api.get<UserProgressAnalytics>("/api/analytics");
}

export async function getExamAnalyticsApi(examId: string): Promise<ExamAnalytics> {
  const data = await api.get<ExamAnalyticsResponse>(`/api/exams/${examId}/analytics`);
  return data.analytics;
}
