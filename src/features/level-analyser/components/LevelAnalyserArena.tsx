import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { QuizArena } from "@/shared/components/QuizArena";
import { QuizNav } from "@/shared/components/QuizNav";
import { useQuizAnswers } from "@/shared/hooks/useQuizAnswers";
import type { QuizAnswer } from "@/shared/types/quiz.types";
import { confirmAction } from "@/shared/utils/confirmAction";

import type { LevelAnalyserSession } from "../types/levelAnalyser.types";

type LevelAnalyserArenaProps = {
  session: LevelAnalyserSession;
  realmName: string;
  submitting: boolean;
  error: string | null;
  onSubmit: (answers: QuizAnswer[]) => void;
  onLeave: () => void;
};

/** Mount with `key={attemptId}` so answers reset per attempt. */
export function LevelAnalyserArena({
  session,
  realmName,
  submitting,
  error,
  onSubmit,
  onLeave,
}: LevelAnalyserArenaProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const quiz = useQuizAnswers(session.questions);
  if (!quiz.current) return null;

  return (
    <QuizArena
      header={
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Level Analyser</Text>
            <Text style={styles.sub}>{realmName}</Text>
          </View>
          <Text
            accessibilityRole="button"
            style={styles.leave}
            onPress={() =>
              confirmAction(
                { title: "Leave analyser?", message: "Your answers will be lost.", confirmLabel: "Leave" },
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
          <Text style={styles.count}>
            {quiz.answeredCount}/{quiz.total} answered
          </Text>
          <QuizNav
            canGoBack={quiz.index > 0}
            isLast={quiz.isLast}
            hasAnswer={quiz.selectedIndex !== null}
            canSubmit={quiz.allAnswered}
            submitting={submitting}
            submitLabel="Reveal my level"
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
  sub: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
  leave: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
  count: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
});
}
