import { api } from "@/services/api";
import type { PublicRealm, RealmAnalyserStatus } from "@/shared/types/study.types";

import type {
  AnalyserStatusesResponse,
  AutofillInput,
  AutofillResponse,
  DeleteRealmResult,
  RealmResponse,
  RealmsResponse,
} from "../types/realms.types";

const base = (examId: string) => `/api/exams/${examId}`;

export async function listRealmsApi(examId: string): Promise<PublicRealm[]> {
  const data = await api.get<RealmsResponse>(`${base(examId)}/realms`);
  return data.realms;
}

export async function createRealmApi(
  examId: string,
  realmName: string,
): Promise<PublicRealm> {
  const data = await api.post<RealmResponse>(`${base(examId)}/realms`, { realmName });
  return data.realm;
}

export async function deleteRealmApi(
  examId: string,
  realmName: string,
): Promise<DeleteRealmResult> {
  return api.delete<DeleteRealmResult>(`${base(examId)}/realms`, { realmName });
}

export async function getAnalyserStatusesApi(
  examId: string,
): Promise<Record<string, RealmAnalyserStatus>> {
  const data = await api.get<AnalyserStatusesResponse>(
    `${base(examId)}/realm-analyser-statuses`,
  );
  return data.statuses;
}

/** AI preview only — never writes to the database. */
export async function generateRealmQuestsApi(
  examId: string,
  input: AutofillInput,
): Promise<AutofillResponse> {
  return api.post<AutofillResponse>(`${base(examId)}/ai/game-plan`, input);
}
