import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { ChipButton } from "@/shared/components/ChipButton";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { QuizArena } from "@/shared/components/QuizArena";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import { QuizFooter } from "../components/QuizFooter";
import { RagReportView } from "../components/RagReportView";
import { ragHref } from "../constants/ragQuiz.constants";
import { useRagSession } from "../hooks/useRagSession";

type RagSessionScreenProps = {
  sessionId: string;
};

function exitQuiz() {
  if (router.canGoBack()) router.back();
  else router.replace(ragHref.home);
}

export function RagSessionScreen({ sessionId }: RagSessionScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const quiz = useRagSession(sessionId);
  const { session, controls } = quiz;

  if (quiz.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading quiz…" />
      </Screen>
    );
  }

  if (quiz.loadError || !session || !controls) {
    return (
      <Screen>
        <ScreenHeader title="Quiz" />
        <EmptyState
          title="Quiz unavailable"
          body={getErrorMessage(quiz.loadError, "This quiz could not be loaded.")}
          actionLabel="Try again"
          onAction={() => void quiz.refetch()}
        />
      </Screen>
    );
  }

  if (controls.isReport) {
    return (
      <RagReportView
        session={session}
        busy={quiz.isBusy}
        noteSaved={quiz.noteSaved}
        error={quiz.error}
        onBuildReport={() => void quiz.finish()}
        onSaveNote={() => void quiz.saveReportNote()}
      />
    );
  }

  const item = session.currentItem;

  if (!item) {
    return (
      <Screen>
        <ScreenHeader title="Quiz" subtitle={session.topic} />
        <Text style={styles.error}>{quiz.error}</Text>
        <Button
          label="Load first question"
          onPress={() => void quiz.next()}
          loading={quiz.isBusy}
        />
      </Screen>
    );
  }

  return (
    <QuizArena
      header={
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.topic} numberOfLines={1}>
              {session.topic}
            </Text>
            <Text style={styles.stats}>
              {session.correctCount} right · {session.wrongCount} wrong · {session.accuracyPercent}%
            </Text>
          </View>
          <ChipButton label="Exit" onPress={exitQuiz} />
        </View>
      }
      progress={{ current: Math.min(item.ordinal, session.questionLimit), total: session.questionLimit }}
      prompt={item.prompt}
      options={item.options}
      selectedIndex={item.userAnswerIndex}
      onSelect={(index) => void quiz.answer(item.id, index)}
      disabled={quiz.isBusy || !controls.awaitingAnswer}
      revealedCorrectOption={item.correctIndex === null ? null : (item.options[item.correctIndex] ?? null)}
      footer={
        <QuizFooter
          session={session}
          controls={controls}
          busy={quiz.isBusy}
          error={quiz.error}
          onNext={() => void quiz.next()}
          onExtend={() => void quiz.extend()}
          onFinish={() => void quiz.finish()}
        />
      }
    />
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  headerCopy: { flex: 1, gap: 2 },
  topic: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  stats: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
