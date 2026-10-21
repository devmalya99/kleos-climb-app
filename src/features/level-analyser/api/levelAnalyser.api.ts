import { api } from "@/services/api";

import type {
  EnsureProgressReportResult,
  ProgressReportResponse,
  PublicProgressReport,
  RegenerateProgressReportResult,
  StartLevelAnalyserResult,
  SubmitLevelAnalyserInput,
  SubmitLevelAnalyserResult,
} from "../types/levelAnalyser.types";

const base = (examId: string, categoryId: string) =>
  `/api/exams/${examId}/categories/${categoryId}`;

export function startLevelAnalyserApi(examId: string, categoryId: string) {
  return api.post<StartLevelAnalyserResult>(`${base(examId, categoryId)}/level-analyser/start`);
}

export function submitLevelAnalyserApi(
  examId: string,
  categoryId: string,
  input: SubmitLevelAnalyserInput,
) {
  return api.post<SubmitLevelAnalyserResult>(
    `${base(examId, categoryId)}/level-analyser/submit`,
    input,
  );
}

/** Cached report only; never triggers AI generation. */
export async function getProgressReportApi(
  examId: string,
  categoryId: string,
): Promise<PublicProgressReport | null> {
  const data = await api.get<ProgressReportResponse>(`${base(examId, categoryId)}/progress-report`);
  return data.report;
}

export function ensureProgressReportApi(examId: string, categoryId: string) {
  return api.post<EnsureProgressReportResult>(`${base(examId, categoryId)}/progress-report/ensure`);
}

export function regenerateProgressReportApi(examId: string, categoryId: string) {
  return api.post<RegenerateProgressReportResult>(
    `${base(examId, categoryId)}/progress-report/regenerate`,
  );
}
