import { SymbolView } from "expo-symbols";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import { TAURUS_QUICK_PROMPTS } from "../constants/taurus.constants";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { taurusIcon } from "./taurusIcon";

const ICONS = {
  "today-plan": taurusIcon("clock.arrow.circlepath", "history"),
  "find-tutorial": taurusIcon("mappin", "location_on"),
  "quiz-me": taurusIcon("bubble.left", "chat"),
} as const;

type PromptChipsProps = {
  disabled: boolean;
  onPress: (message: string) => void;
};

/** One-line shortcuts. Width follows the label so the row stays short. */
export function PromptChips({ disabled, onPress }: PromptChipsProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroller}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {TAURUS_QUICK_PROMPTS.map((prompt) => (
        <PressableScale
          key={prompt.id}
          accessibilityLabel={prompt.label}
          accessibilityState={{ disabled }}
          disabled={disabled}
          pressedScale={0.94}
          onPress={() => onPress(prompt.message)}
          style={[styles.chip, disabled ? styles.disabled : null]}
        >
          <View style={styles.labelRow}>
            <SymbolView name={ICONS[prompt.id]} tintColor={chrome.ink} size={16} />
            <Text style={styles.label} numberOfLines={1}>
              {prompt.label}
            </Text>
          </View>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    scroller: { marginHorizontal: -spacing.md, flexGrow: 0 },
    row: { gap: spacing.sm, paddingHorizontal: spacing.md },
    chip: {
      minHeight: 44,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
      alignItems: "center",
      justifyContent: "center",
    },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    label: { fontFamily: typography.bodyMedium, fontSize: 14, color: chrome.ink },
    disabled: { opacity: 0.5 },
  });
}
