import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";
import { confirmAction } from "@/shared/utils/confirmAction";

import {
  createConversationApi,
  deleteConversationApi,
  getActiveConversationApi,
  getConversationApi,
  listConversationsApi,
} from "../api/conversations.api";
import { TAURUS_QUERY_KEYS } from "../constants/taurus.constants";
import type { TaurusConversationSummary } from "../types/taurus.types";

/**
 * Conversation history plus the open conversation. With no explicit selection
 * the server returns its most recent thread (or creates one), which also gives
 * the right behaviour after deleting the open thread.
 */
export function useTaurusConversations() {
  const queryClient = useQueryClient();
  const { error, run, clearError } = useSoftAction();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: TAURUS_QUERY_KEYS.conversations,
    queryFn: listConversationsApi,
  });

  const conversationQuery = useQuery({
    queryKey: TAURUS_QUERY_KEYS.conversation(selectedId),
    queryFn: () => (selectedId ? getConversationApi(selectedId) : getActiveConversationApi()),
    // The chat owns the live thread; never reseed it from a cached copy.
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const create = useMutation({ mutationFn: createConversationApi });
  const remove = useMutation({ mutationFn: deleteConversationApi });

  async function startNewChat() {
    const result = await run(() => create.mutateAsync(), "Could not start a new chat");
    if (!result.ok) return false;
    queryClient.setQueryData(TAURUS_QUERY_KEYS.conversation(result.value.id), result.value);
    setSelectedId(result.value.id);
    void queryClient.invalidateQueries({ queryKey: TAURUS_QUERY_KEYS.conversations });
    return true;
  }

  function openConversation(conversationId: string) {
    clearError();
    setSelectedId(conversationId);
  }

  function deleteConversation(conversation: TaurusConversationSummary) {
    confirmAction(
      { title: "Delete chat?", message: `"${conversation.title}" will be removed.` },
      () =>
        void run(() => remove.mutateAsync(conversation.id), "Could not delete the chat").then(
          async (result) => {
            if (!result.ok) return;
            if (conversationQuery.data?.id === conversation.id) setSelectedId(null);
            await queryClient.invalidateQueries({ queryKey: TAURUS_QUERY_KEYS.all });
          },
        ),
    );
  }

  return {
    conversations: listQuery.data ?? [],
    conversation: conversationQuery.data ?? null,
    isLoading: conversationQuery.isLoading,
    loadError: conversationQuery.error,
    refetch: conversationQuery.refetch,
    isWorking: create.isPending || remove.isPending,
    error,
    startNewChat,
    openConversation,
    deleteConversation,
  };
}
