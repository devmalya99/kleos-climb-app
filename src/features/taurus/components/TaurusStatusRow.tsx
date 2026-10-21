import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";

import type { TaurusTrailStatus } from "../hooks/useTaurusTrail";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { taurusIcon } from "./taurusIcon";

type TaurusStatusRowProps = {
  status: TaurusTrailStatus;
};

export function TaurusStatusRow({ status }: TaurusStatusRowProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  return (
    <View style={styles.pill}>
      <View style={styles.dot} />
      <Text style={[styles.label, styles.shrink]} numberOfLines={1}>
        {status.trail}
      </Text>
      <Text style={styles.sep}>·</Text>
      <SymbolView name={taurusIcon("mountain.2.fill", "landscape")} tintColor={chrome.muted} size={13} />
      <Text style={styles.label}>{status.campLabel}</Text>
      <Text style={styles.sep}>·</Text>
      <SymbolView name={taurusIcon("bolt.fill", "bolt")} tintColor={chrome.muted} size={13} />
      <Text style={[styles.label, styles.shrink]} numberOfLines={1}>
        {status.phase}
      </Text>
    </View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    pill: {
      alignSelf: "flex-start",
      maxWidth: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
    },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: chrome.blue },
    label: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.ink },
    shrink: { flexShrink: 1 },
    sep: { fontFamily: typography.body, fontSize: 13, color: chrome.subtle },
  });
}
