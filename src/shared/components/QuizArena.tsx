import { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { playSelectHaptic } from "@/shared/utils/quizHaptics";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type QuizArenaProps = {
  /** Slot above the question: title, HUD, timer. */
  header?: ReactNode;
  /** Shows "current / total" and a progress bar when set. */
  progress?: { current: number; total: number };
  prompt: string;
  options: readonly string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  /** Locks the options (submitting, or showing feedback). */
  disabled?: boolean;
  /**
   * Option text to highlight as correct. Only pass this once the server has
   * revealed it (e.g. Colosseum wrong-answer feedback); never before.
   */
  revealedCorrectOption?: string | null;
  /** Slot below the options: navigation or continue buttons. */
  footer?: ReactNode;
};

/** Full-screen question UI shared by quizzes. Presentation only — no scoring. */
export function QuizArena({
  header,
  progress,
  prompt,
  options,
  selectedIndex,
  onSelect,
  disabled = false,
  revealedCorrectOption = null,
  footer,
}: QuizArenaProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {header}
        {progress ? (
          <View style={styles.progressWrap}>
            <Text style={styles.progressLabel}>
              Question {progress.current} of {progress.total}
            </Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${(progress.current / progress.total) * 100}%` },
                ]}
              />
            </View>
          </View>
        ) : null}

        <Text style={styles.prompt}>{prompt}</Text>

        <View style={styles.options}>
          {options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrect = revealedCorrectOption !== null && option === revealedCorrectOption;
            const isWrong = revealedCorrectOption !== null && isSelected && !isCorrect;
            return (
              <Pressable
                key={`${index}-${option}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled }}
                disabled={disabled}
                onPress={() => {
                  playSelectHaptic();
                  onSelect(index);
                }}
                style={({ pressed }) => [
                  styles.option,
                  isSelected ? styles.optionSelected : null,
                  isCorrect ? styles.optionCorrect : null,
                  isWrong ? styles.optionWrong : null,
                  pressed && !disabled ? styles.optionPressed : null,
                ]}
              >
                <Text style={styles.letter}>{OPTION_LETTERS[index]}</Text>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        {footer}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, gap: spacing.lg, flexGrow: 1 },
  progressWrap: { gap: spacing.xs },
  progressLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: colors.inkMuted,
  },
  track: {
    height: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.bgMuted,
    overflow: "hidden",
  },
  fill: { height: 6, backgroundColor: colors.accentFill },
  prompt: {
    fontFamily: typography.bodyBold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },
  options: { gap: spacing.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.bgMuted,
    backgroundColor: colors.bgElevated,
  },
  optionSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionCorrect: { borderColor: colors.success, backgroundColor: "rgba(31, 169, 113, 0.18)" },
  optionWrong: { borderColor: colors.danger, backgroundColor: "rgba(226, 75, 75, 0.18)" },
  optionPressed: { opacity: 0.85 },
  letter: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.accent,
    width: 24,
  },
  optionText: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
});
}
