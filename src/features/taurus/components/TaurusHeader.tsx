import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { taurusIcon } from "./taurusIcon";

type TaurusHeaderProps = {
  newDisabled: boolean;
  onChats: () => void;
  onNew: () => void;
};

export function TaurusHeader({ newDisabled, onChats, onNew }: TaurusHeaderProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <Text style={styles.markGlyph}>♉</Text>
        </View>
        <Text style={styles.title}>Taurus</Text>
        <View style={styles.live} />
      </View>
      <View style={styles.actions}>
        <PressableScale onPress={onChats} pressedScale={0.94} style={styles.chats}>
          <SymbolView name={taurusIcon("bubble.left", "chat")} tintColor={chrome.ink} size={14} />
          <Text style={styles.chatsLabel}>Chats</Text>
        </PressableScale>
        <PressableScale
          accessibilityState={{ disabled: newDisabled }}
          disabled={newDisabled}
          pressedScale={0.94}
          onPress={onNew}
          style={[styles.newChat, newDisabled ? styles.disabled : null]}
        >
          <SymbolView name={taurusIcon("plus", "add")} tintColor={chrome.honeyInk} size={14} />
          <Text style={styles.newLabel}>New</Text>
        </PressableScale>
      </View>
    </View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    brand: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    mark: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: chrome.mark,
      alignItems: "center",
      justifyContent: "center",
    },
    markGlyph: { fontSize: 18, color: chrome.markInk, lineHeight: 22 },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 28,
      letterSpacing: -0.5,
      color: chrome.ink,
    },
    live: { width: 8, height: 8, borderRadius: 4, backgroundColor: chrome.honey },
    actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    chats: {
      minHeight: 36,
      paddingHorizontal: spacing.md,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: chrome.line,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    chatsLabel: { fontFamily: typography.bodyMedium, fontSize: 14, color: chrome.ink },
    newChat: {
      minHeight: 36,
      paddingHorizontal: spacing.md,
      borderRadius: 999,
      backgroundColor: chrome.honey,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    newLabel: { fontFamily: typography.bodyBold, fontSize: 14, color: chrome.honeyInk },
    disabled: { opacity: 0.5 },
  });
}
