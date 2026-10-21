import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { QuizArena } from "@/shared/components/QuizArena";
import { QuizNav } from "@/shared/components/QuizNav";
import { formatCountdown, useCountdown } from "@/shared/hooks/useCountdown";
import { useQuizAnswers } from "@/shared/hooks/useQuizAnswers";
import type { QuizAnswer } from "@/shared/types/quiz.types";
import { confirmAction } from "@/shared/utils/confirmAction";

import type { QuestQuizSession } from "../types/questQuiz.types";

type QuestQuizArenaProps = {
  session: QuestQuizSession;
  submitting: boolean;
  error: string | null;
  onSubmit: (answers: QuizAnswer[]) => void;
  onTimeout: (answers: QuizAnswer[]) => void;
  onLeave: () => void;
};

/** Mount with `key={attemptId}` so answers reset for every new attempt. */
export function QuestQuizArena({
  session,
  submitting,
  error,
  onSubmit,
  onTimeout,
  onLeave,
}: QuestQuizArenaProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const quiz = useQuizAnswers(session.questions);
  const { timer } = session;

  const remaining = useCountdown(
    timer.enabled && timer.mode === "overall" ? timer.totalSeconds : null,
    session.attemptId,
    () => onTimeout(quiz.toAnswers()),
  );

  if (!quiz.current) return null;

  return (
    <QuizArena
      header={
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Final showdown</Text>
            <Text style={styles.skill}>
              {session.questSkill.skillName} · {session.questSkill.rankLabel}
            </Text>
          </View>
          {remaining !== null ? <Text style={styles.timer}>{formatCountdown(remaining)}</Text> : null}
          <Text
            accessibilityRole="button"
            style={styles.leave}
            onPress={() =>
              confirmAction(
                { title: "Leave trial?", message: "Your progress in this trial will be lost.", confirmLabel: "Leave" },
                onLeave,
              )
            }
          >
            Leave
          </Text>
        </View>
      }
      progress={{ current: quiz.index + 1, total: quiz.total }}
      prompt={quiz.current.prompt}
      options={quiz.current.options}
      selectedIndex={quiz.selectedIndex}
      onSelect={quiz.select}
      disabled={submitting}
      footer={
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <QuizNav
            canGoBack={quiz.index > 0}
            isLast={quiz.isLast}
            hasAnswer={quiz.selectedIndex !== null}
            canSubmit={quiz.allAnswered}
            submitting={submitting}
            submitLabel="Claim victory"
            onBack={quiz.back}
            onNext={quiz.next}
            onSubmit={() => onSubmit(quiz.toAnswers())}
          />
        </>
      }
    />
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  headerCopy: { flex: 1 },
  title: { fontFamily: typography.display, fontSize: 28, letterSpacing: 1, color: colors.accent },
  skill: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
  timer: { fontFamily: typography.display, fontSize: 28, color: colors.warning },
  leave: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
