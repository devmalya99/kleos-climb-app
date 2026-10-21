import { api } from "@/services/api";

import type {
  ConversationsResponse,
  TaurusConversationDetail,
  TaurusConversationSummary,
} from "../types/taurus.types";

const base = "/api/taurus/conversations";

export async function listConversationsApi(): Promise<TaurusConversationSummary[]> {
  const data = await api.get<ConversationsResponse>(base);
  return data.conversations;
}

/** Latest conversation, or a fresh one when the user has none. */
export async function getActiveConversationApi(): Promise<TaurusConversationDetail> {
  return api.get<TaurusConversationDetail>(`${base}?mode=active`);
}

export async function getConversationApi(
  conversationId: string,
): Promise<TaurusConversationDetail> {
  return api.get<TaurusConversationDetail>(`${base}/${conversationId}`);
}

export async function createConversationApi(): Promise<TaurusConversationDetail> {
  return api.post<TaurusConversationDetail>(base);
}

export async function deleteConversationApi(conversationId: string): Promise<void> {
  await api.delete(`${base}/${conversationId}`);
}
