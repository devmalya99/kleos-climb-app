import { useRef } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { spacing, typography, useTheme } from "@/app/theme";

import { useTaurusChat } from "../hooks/useTaurusChat";
import type { TaurusMessage } from "../types/taurus.types";
import { formatSessionStamp, taurusGreeting } from "../utils/formatSessionStamp";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { ChatComposer } from "./ChatComposer";
import { MessageBubble } from "./MessageBubble";
import { PromptChips } from "./PromptChips";

type ChatPaneProps = {
  conversationId: string;
  initialMessages: TaurusMessage[];
  activityAt: string;
};

/** Message list + composer for one conversation. Render with `key={conversationId}`. */
export function ChatPane({ conversationId, initialMessages, activityAt }: ChatPaneProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  const chat = useTaurusChat(conversationId, initialMessages);
  const scrollRef = useRef<ScrollView>(null);
  const knownIds = useRef<Set<string> | null>(null);
  const enterIds = useRef(new Set<string>());
  if (knownIds.current === null) {
    knownIds.current = new Set(chat.messages.map((message) => message.id));
  } else {
    for (const message of chat.messages) {
      if (knownIds.current.has(message.id)) continue;
      enterIds.current.add(message.id);
      knownIds.current.add(message.id);
    }
  }
  const lastIndex = chat.messages.length - 1;
  const stamp = formatSessionStamp(activityAt);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <PromptChips disabled={chat.isStreaming} onPress={(message) => void chat.send(message)} />
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {stamp ? (
          <View style={styles.stampRow}>
            <View style={styles.stampLine} />
            <Text style={styles.stamp}>{stamp}</Text>
            <View style={styles.stampLine} />
          </View>
        ) : null}
        {chat.messages.length === 0 ? (
          <Animated.View entering={FadeIn.duration(360)} style={styles.greeting}>
            <Text style={styles.greetingText}>{taurusGreeting()}</Text>
          </Animated.View>
        ) : null}
        {chat.messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            streaming={chat.isStreaming && index === lastIndex && message.role === "assistant"}
            sentAt={chat.sentAt?.[message.id]}
            enter={enterIds.current.has(message.id)}
          />
        ))}
      </ScrollView>

      {chat.error ? <Text style={styles.error}>{chat.error}</Text> : null}
      <ChatComposer streaming={chat.isStreaming} onSend={chat.send} onStop={chat.stop} />
    </KeyboardAvoidingView>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    flex: { flex: 1, gap: spacing.sm },
    list: { gap: spacing.md, paddingVertical: spacing.sm },
    stampRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    stampLine: { flex: 1, height: 1, backgroundColor: chrome.line },
    stamp: {
      fontFamily: typography.bodyMedium,
      fontSize: 11,
      letterSpacing: 1,
      color: chrome.subtle,
    },
    greeting: {
      alignSelf: "flex-start",
      maxWidth: "88%",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 22,
      backgroundColor: chrome.card,
    },
    greetingText: {
      fontFamily: typography.body,
      fontSize: 16,
      lineHeight: 23,
      color: chrome.ink,
    },
    error: { fontFamily: typography.bodyMedium, fontSize: 14, color: chrome.danger },
  });
}
