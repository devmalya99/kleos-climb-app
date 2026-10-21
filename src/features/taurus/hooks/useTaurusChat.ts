import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";

import { openChatStream } from "../api/chat.api";
import {
  STREAM_DONE_SENTINEL,
  TAURUS_QUERY_KEYS,
} from "../constants/taurus.constants";
import type { StreamChunk, TaurusMessage } from "../types/taurus.types";
import { applyStreamChunk } from "../utils/applyStreamChunk";
import { messageHasTools, toRequestMessages } from "../utils/messageParts";
import { createSseParser } from "../utils/sseParser";

function newId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useTaurusChat(
  conversationId: string,
  initialMessages: TaurusMessage[],
) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<TaurusMessage[]>(initialMessages);
  const [sentAt, setSentAt] = useState<Record<string, number>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const send = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return false;

      setError(null);
      const userMessage: TaurusMessage = {
        id: newId(),
        role: "user",
        parts: [{ type: "text", text: trimmed }],
      };
      setSentAt((current) => ({ ...current, [userMessage.id]: Date.now() }));
      const assistantSeed: TaurusMessage = {
        id: newId(),
        role: "assistant",
        parts: [],
      };

      let thread = [...messagesRef.current, userMessage];
      setMessages([...thread, assistantSeed]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      let assistant = assistantSeed;
      let sawTools = false;

      try {
        const response = await openChatStream({
          conversationId,
          messages: toRequestMessages(thread),
          signal: controller.signal,
        });

        const body = response.body;
        if (!body) throw new Error("Empty stream body");

        const reader = body.getReader();
        const decoder = new TextDecoder();
        const parser = createSseParser((data) => {
          if (data === STREAM_DONE_SENTINEL) return;
          let chunk: StreamChunk;
          try {
            chunk = JSON.parse(data) as StreamChunk;
          } catch {
            return;
          }
          assistant = applyStreamChunk(assistant, chunk);
          if (messageHasTools(assistant)) sawTools = true;
          setMessages([...thread, assistant]);
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          parser.push(decoder.decode(value, { stream: true }));
        }

        thread = [...thread, assistant];
        setMessages(thread);

        await queryClient.invalidateQueries({
          queryKey: TAURUS_QUERY_KEYS.conversations,
        });
        if (sawTools) {
          await queryClient.invalidateQueries({ queryKey: ["exams"] });
          await queryClient.invalidateQueries({ queryKey: ["brain-clutter"] });
        }
        return true;
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          logger.info("Taurus stream aborted");
          return true;
        }
        logger.error("Taurus chat failed", err);
        setError(getErrorMessage(err, "Taurus could not reply."));
        return false;
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [conversationId, isStreaming, queryClient],
  );

  return { messages, sentAt, isStreaming, error, send, stop };
}
