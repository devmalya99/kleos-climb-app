import { StyleSheet, Text } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { useQuests } from "@/features/quests";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { UnlockOverlay } from "@/shared/components/UnlockOverlay";
import { formatRetryAt } from "@/shared/utils/formatRetryAt";

import { QuestQuizArena } from "../components/QuestQuizArena";
import { QuestQuizResult } from "../components/QuestQuizResult";
import { QUEST_QUIZ_QUESTION_COUNT } from "../constants/questQuiz.constants";
import { useQuestQuiz } from "../hooks/useQuestQuiz";

type QuestQuizScreenProps = {
  examId: string;
  topicId: string;
};

export function QuestQuizScreen({ examId, topicId }: QuestQuizScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const quiz = useQuestQuiz(examId, topicId);
  const questsQuery = useQuests(examId);
  const questName = questsQuery.data?.find((quest) => quest.id === topicId)?.name ?? "Quest";

  if (quiz.session) {
    return (
      <QuestQuizArena
        key={quiz.session.attemptId}
        session={quiz.session}
        submitting={quiz.isSubmitting}
        error={quiz.actionError}
        onSubmit={(answers) => void quiz.submit(answers)}
        onTimeout={(answers) => void quiz.timeout(answers)}
        onLeave={quiz.leave}
      />
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Final showdown" subtitle={questName} />
      <Text style={styles.body}>
        Answer {QUEST_QUIZ_QUESTION_COUNT} questions forged for this quest. You need every answer
        correct to claim the quest and its XP.
      </Text>

      {quiz.startFailure ? (
        <>
          <Text style={styles.error}>{quiz.startFailure.message}</Text>
          {formatRetryAt(quiz.startFailure.retryAt) ? (
            <Text style={styles.body}>{formatRetryAt(quiz.startFailure.retryAt)}</Text>
          ) : null}
        </>
      ) : null}

      <Button
        label={quiz.isStarting ? "Summoning questions…" : "Begin trial"}
        onPress={() => void quiz.start()}
        loading={quiz.isStarting}
        disabled={Boolean(quiz.outcome?.passed)}
      />
      <Button label="Back" variant="ghost" onPress={quiz.leave} />

      <QuestQuizResult
        visible={!quiz.currentUnlock}
        outcome={quiz.outcome}
        onRetry={() => void quiz.start()}
        onClose={quiz.leave}
      />
      <UnlockOverlay kind={quiz.currentUnlock} onDismiss={quiz.dismissUnlock} />
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  body: { fontFamily: typography.body, fontSize: 16, lineHeight: 24, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.danger },
});
}
