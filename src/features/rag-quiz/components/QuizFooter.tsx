import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";

import type { RagSession } from "../types/ragQuiz.types";
import type { SessionControls } from "../utils/ragQuiz.utils";

type QuizFooterProps = {
  session: RagSession;
  controls: SessionControls;
  busy: boolean;
  error: string | null;
  onNext: () => void;
  onExtend: () => void;
  onFinish: () => void;
};

/** Verdict, explanation and the next-step buttons shown under the question. */
export function QuizFooter({
  session,
  controls,
  busy,
  error,
  onNext,
  onExtend,
  onFinish,
}: QuizFooterProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const item = session.currentItem;
  const answered = item !== null && item.userAnswerIndex !== null;

  return (
    <View style={styles.wrap}>
      {answered ? (
        <Text style={[styles.verdict, item.isCorrect ? styles.correct : styles.wrong]}>
          {item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </Text>
      ) : null}
      {answered && item.explanation ? <Text style={styles.explanation}>{item.explanation}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {controls.canNext ? <Button label="Next question" onPress={onNext} loading={busy} /> : null}
      {controls.canExtend ? (
        <Button label={`Continue to ${session.canExtendTo} questions`} onPress={onExtend} loading={busy} />
      ) : null}
      {controls.canFinish ? (
        <Button
          label={controls.canNext || controls.canExtend ? "End and get report" : "Finish and get report"}
          variant="secondary"
          onPress={onFinish}
          disabled={busy}
        />
      ) : null}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.md },
  verdict: { fontFamily: typography.bodyBold, fontSize: 18 },
  correct: { color: colors.success },
  wrong: { color: colors.danger },
  explanation: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink,
  },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
