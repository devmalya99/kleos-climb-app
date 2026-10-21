import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import { TAURUS_MESSAGE_MAX_CHARS } from "../constants/taurus.constants";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { taurusIcon } from "./taurusIcon";

type ChatComposerProps = {
  streaming: boolean;
  onSend: (text: string) => Promise<boolean>;
  onStop: () => void;
};

export function ChatComposer({ streaming, onSend, onStop }: ChatComposerProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  const [text, setText] = useState("");
  const canSend = text.trim().length > 0 && !streaming;

  async function handleSend() {
    if (!canSend) return;
    const draft = text;
    setText("");
    const ok = await onSend(draft);
    if (!ok) setText((current) => (current ? current : draft));
  }

  return (
    <View style={styles.bar}>
      <View style={styles.iconHit}>
        <SymbolView name={taurusIcon("plus", "add")} tintColor={chrome.muted} size={20} />
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message Taurus..."
        placeholderTextColor={chrome.subtle}
        multiline
        maxLength={TAURUS_MESSAGE_MAX_CHARS}
        style={styles.input}
      />
      <View style={styles.iconHit}>
        <SymbolView name={taurusIcon("mic", "mic")} tintColor={chrome.muted} size={18} />
      </View>
      {streaming ? (
        <PressableScale onPress={onStop} pressedScale={0.94} style={[styles.send, styles.stop]}>
          <Text style={styles.stopLabel}>Stop</Text>
        </PressableScale>
      ) : (
        <PressableScale
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          pressedScale={0.94}
          onPress={() => void handleSend()}
          style={[styles.send, !canSend ? styles.disabled : null]}
        >
          <Text style={styles.sendLabel}>Send</Text>
          <SymbolView name={taurusIcon("arrow.up", "arrow_upward")} tintColor={chrome.honeyInk} size={14} />
        </PressableScale>
      )}
    </View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    bar: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: spacing.xs,
      minHeight: 52,
      paddingLeft: spacing.sm,
      paddingRight: spacing.xs,
      paddingVertical: spacing.xs,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
    },
    iconHit: {
      width: 32,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 120,
      paddingTop: 10,
      paddingBottom: 10,
      fontFamily: typography.body,
      fontSize: 16,
      color: chrome.ink,
    },
    send: {
      minHeight: 40,
      paddingHorizontal: spacing.md,
      borderRadius: 999,
      backgroundColor: chrome.honey,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 2,
    },
    stop: { backgroundColor: chrome.danger },
    disabled: { opacity: 0.45 },
    sendLabel: { fontFamily: typography.bodyBold, fontSize: 15, color: chrome.honeyInk },
    stopLabel: { fontFamily: typography.bodyBold, fontSize: 15, color: "#FFFFFF" },
  });
}
