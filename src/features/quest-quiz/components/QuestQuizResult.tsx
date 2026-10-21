import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { ResultOverlay } from "@/shared/components/ResultOverlay";
import { formatRetryAt } from "@/shared/utils/formatRetryAt";

import { QUEST_QUIZ_QUESTION_COUNT } from "../constants/questQuiz.constants";
import type { QuestQuizOutcome } from "../types/questQuiz.types";

type QuestQuizResultProps = {
  /** Hidden while an unlock celebration is showing. */
  visible: boolean;
  outcome: QuestQuizOutcome | null;
  onRetry: () => void;
  onClose: () => void;
};

export function QuestQuizResult({ visible, outcome, onRetry, onClose }: QuestQuizResultProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (!outcome) return null;

  if (outcome.passed) {
    const award = outcome.skillAward;
    return (
      <ResultOverlay
        visible={visible}
        tone="success"
        title="Quest complete"
        subtitle={`${outcome.score}/${QUEST_QUIZ_QUESTION_COUNT} correct. +${outcome.xpAwarded} XP claimed.`}
        onRequestClose={onClose}
        actions={<Button label="Back to realm" onPress={onClose} />}
      >
        {award ? (
          <Text style={styles.detail}>
            {award.skillName}: +{award.xpAwarded} XP
            {award.rankUp ? ` · Rank up to ${award.newRank}!` : ""}
          </Text>
        ) : null}
      </ResultOverlay>
    );
  }

  return (
    <ResultOverlay
      visible={visible}
      tone="danger"
      title={outcome.reason === "timeout" ? "Time's up" : "Not this time"}
      subtitle={`${outcome.score}/${QUEST_QUIZ_QUESTION_COUNT} correct. You need a perfect score to claim this quest.`}
      onRequestClose={onClose}
      actions={
        <>
          <Button label="Try again" onPress={onRetry} />
          <Button label="Back to realm" variant="ghost" onPress={onClose} />
        </>
      }
    >
      {formatRetryAt(outcome.retryAt) ? (
        <Text style={styles.detail}>{formatRetryAt(outcome.retryAt)}</Text>
      ) : null}
      {outcome.missed.length > 0 ? <Text style={styles.heading}>Review</Text> : null}
      {outcome.missed.map((item, index) => (
        <View key={`${index}-${item.prompt}`} style={styles.missed}>
          <Text style={styles.prompt}>{item.prompt}</Text>
          <Text style={styles.wrong}>Your answer: {item.selectedOption ?? "No answer"}</Text>
          <Text style={styles.right}>Correct: {item.correctOption}</Text>
        </View>
      ))}
    </ResultOverlay>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  detail: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.inkMuted },
  heading: { fontFamily: typography.bodyBold, fontSize: 20, letterSpacing: -0.2, color: colors.ink },
  missed: { gap: 2, paddingBottom: spacing.sm },
  prompt: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  wrong: { fontFamily: typography.body, fontSize: 14, color: colors.danger },
  right: { fontFamily: typography.body, fontSize: 14, color: colors.success },
});
}
