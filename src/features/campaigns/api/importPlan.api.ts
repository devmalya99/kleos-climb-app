import { api } from "@/services/api";

import type {
  ImportPlanCommitResponse,
  ImportPlanPreviewResponse,
  ImportPlanProposal,
  ParseTopicsResponse,
} from "../types/campaigns.types";

/** AI preview only — never writes to the database. */
export async function previewImportPlanApi(
  examId: string,
  text: string,
): Promise<ImportPlanPreviewResponse> {
  return api.post<ImportPlanPreviewResponse>(
    `/api/exams/${examId}/import-plan/preview`,
    { text },
  );
}

export async function commitImportPlanApi(
  examId: string,
  proposal: ImportPlanProposal,
): Promise<ImportPlanCommitResponse> {
  return api.post<ImportPlanCommitResponse>(
    `/api/exams/${examId}/import-plan/commit`,
    { realms: proposal.realms },
  );
}

/** Flat topic parser; also preview-only. Not used by a screen yet. */
export async function parseTopicsApi(
  text: string,
  suggestYoutube?: boolean,
): Promise<ParseTopicsResponse> {
  return api.post<ParseTopicsResponse>("/api/ai/parse-topics", { text, suggestYoutube });
}
