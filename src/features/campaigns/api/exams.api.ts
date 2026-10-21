import { api } from "@/services/api";
import type { PublicExam } from "@/shared/types/study.types";

import type { CampaignInput, ExamResponse, ExamsResponse } from "../types/campaigns.types";

export async function listExamsApi(): Promise<PublicExam[]> {
  const data = await api.get<ExamsResponse>("/api/exams");
  return data.exams;
}

export async function getExamApi(examId: string): Promise<PublicExam> {
  const data = await api.get<ExamResponse>(`/api/exams/${examId}`);
  return data.exam;
}

export async function createExamApi(input: CampaignInput): Promise<PublicExam> {
  const data = await api.post<ExamResponse>("/api/exams", input);
  return data.exam;
}

export async function updateExamApi(
  examId: string,
  input: Partial<CampaignInput>,
): Promise<PublicExam> {
  const data = await api.patch<ExamResponse>(`/api/exams/${examId}`, input);
  return data.exam;
}

export async function deleteExamApi(examId: string): Promise<void> {
  await api.delete(`/api/exams/${examId}`);
}
