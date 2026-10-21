import { StyleSheet, View } from "react-native";

import { spacing } from "@/app/theme";

import { Button } from "./Button";

type QuizNavProps = {
  canGoBack: boolean;
  isLast: boolean;
  hasAnswer: boolean;
  /** Every question answered — enables Submit. */
  canSubmit: boolean;
  submitting: boolean;
  submitLabel?: string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

/** Back / Next / Submit row for sequential quizzes. */
export function QuizNav({
  canGoBack,
  isLast,
  hasAnswer,
  canSubmit,
  submitting,
  submitLabel = "Submit",
  onBack,
  onNext,
  onSubmit,
}: QuizNavProps) {
  return (
    <View style={styles.row}>
      <Button
        label="Back"
        variant="secondary"
        onPress={onBack}
        disabled={!canGoBack || submitting}
        style={styles.half}
      />
      {isLast ? (
        <Button
          label={submitLabel}
          onPress={onSubmit}
          disabled={!canSubmit}
          loading={submitting}
          style={styles.half}
        />
      ) : (
        <Button
          label="Next"
          onPress={onNext}
          disabled={!hasAnswer}
          style={styles.half}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  half: { flex: 1 },
});
