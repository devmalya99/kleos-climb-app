import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { spacing, typography, useTheme } from "@/app/theme";

import type { TaurusMessage } from "../types/taurus.types";
import { layoutAssistantMessage } from "../utils/assistantLayout";
import { formatClock } from "../utils/formatSessionStamp";
import { getMessageText, isToolPart } from "../utils/messageParts";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { AssistantCard } from "./AssistantCard";
import { RichText } from "./RichText";
import { ToolChip } from "./ToolChip";

type MessageBubbleProps = {
  message: TaurusMessage;
  /** True for the assistant message that is still receiving tokens. */
  streaming: boolean;
  /** Local send time. History loaded from the server has none. */
  sentAt?: number;
  /** Play the arrival motion. History loaded with the thread stays still. */
  enter?: boolean;
};

export function MessageBubble({ message, streaming, sentAt, enter = false }: MessageBubbleProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  const isUser = message.role === "user";
  const text = getMessageText(message);
  const toolParts = message.parts.filter(isToolPart);
  const layout = !isUser && text ? layoutAssistantMessage(text) : null;

  if (!text && toolParts.length === 0 && !streaming) return null;

  const tools = toolParts.map((part, index) => (
    <ToolChip key={String(part.toolCallId ?? index)} part={part} />
  ));
  const entering = !enter
    ? undefined
    : isUser
      ? FadeInDown.duration(240).springify().damping(16)
      : FadeInUp.duration(280).springify().damping(18);

  if (layout?.rich) {
    return (
      <Animated.View entering={entering}>
        <AssistantCard layout={layout} tools={tools} />
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={entering} style={[styles.row, isUser ? styles.rowUser : null]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {tools}
        {text ? (
          <RichText
            text={text}
            style={isUser ? styles.textUser : styles.text}
            codeColor={chrome.honey}
          />
        ) : streaming ? (
          <ThinkingPulse color={chrome.subtle} />
        ) : null}
        {isUser && sentAt ? <Text style={styles.meta}>{formatClock(sentAt)} · Delivered</Text> : null}
      </View>
    </Animated.View>
  );
}

function ThinkingPulse({ color }: { color: string }) {
  const opacity = useSharedValue(0.35);
  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 650 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity]);

  return <Animated.Text style={[thinkingStyle, { color }, animated]}>Thinking…</Animated.Text>;
}

const thinkingStyle = {
  fontFamily: typography.bodyMedium,
  fontSize: 15,
} as const;

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    row: { flexDirection: "row" },
    rowUser: { justifyContent: "flex-end" },
    bubble: {
      maxWidth: "88%",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 22,
    },
    bubbleUser: {
      backgroundColor: chrome.card,
      borderWidth: 1,
      borderColor: chrome.userBorder,
    },
    bubbleAssistant: { backgroundColor: chrome.card },
    text: {
      fontFamily: typography.body,
      fontSize: 16,
      lineHeight: 23,
      color: chrome.ink,
    },
    textUser: {
      fontFamily: typography.body,
      fontSize: 16,
      lineHeight: 23,
      color: chrome.ink,
    },
    meta: {
      alignSelf: "flex-end",
      fontFamily: typography.bodyMedium,
      fontSize: 11,
      color: chrome.subtle,
    },
  });
}
