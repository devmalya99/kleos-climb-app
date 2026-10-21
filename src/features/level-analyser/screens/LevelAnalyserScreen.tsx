import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { useRealmAnalyserStatuses, useRealms } from "@/features/realms";
import { Button } from "@/shared/components/Button";
import { ResultOverlay } from "@/shared/components/ResultOverlay";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { UnlockOverlay } from "@/shared/components/UnlockOverlay";
import { formatRetryAt } from "@/shared/utils/formatRetryAt";

import { LevelAnalyserArena } from "../components/LevelAnalyserArena";
import { ProgressReportSheet } from "../components/ProgressReportSheet";
import {
  LEVEL_ANALYSER_MAX_SCORE,
  LEVEL_ANALYSER_QUESTION_COUNT,
} from "../constants/levelAnalyser.constants";
import { useLevelAnalyser } from "../hooks/useLevelAnalyser";

type LevelAnalyserScreenProps = {
  examId: string;
  categoryId: string;
};

export function LevelAnalyserScreen({ examId, categoryId }: LevelAnalyserScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const analyser = useLevelAnalyser(examId, categoryId);
  const realmsQuery = useRealms(examId);
  const statusesQuery = useRealmAnalyserStatuses(examId);
  const [reportOpen, setReportOpen] = useState(false);

  const realmName = realmsQuery.data?.find((realm) => realm.id === categoryId)?.name ?? "Realm";
  const status = statusesQuery.data?.[categoryId];
  const retryMessage = formatRetryAt(analyser.startFailure?.retryAt ?? status?.retryAt);
  const blockedByCooldown = status ? !status.canChallenge : false;

  if (analyser.session) {
    return (
      <LevelAnalyserArena
        key={analyser.session.attemptId}
        session={analyser.session}
        realmName={realmName}
        submitting={analyser.isSubmitting}
        error={analyser.actionError}
        onSubmit={(answers) => void analyser.submit(answers)}
        onLeave={analyser.leave}
      />
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Level Analyser" subtitle={realmName} />
      <Text style={styles.body}>
        {LEVEL_ANALYSER_QUESTION_COUNT} questions across this realm (10 basic, 5 deeper, 5
        advanced), scored out of {LEVEL_ANALYSER_MAX_SCORE}. Your result sets a mastery badge and
        a progress report.
      </Text>
      {status?.hasBadge && status.tierLabel ? (
        <Text style={styles.body}>Current badge: {status.tierLabel}</Text>
      ) : null}

      {analyser.startFailure ? <Text style={styles.error}>{analyser.startFailure.message}</Text> : null}
      {(blockedByCooldown || analyser.startFailure) && retryMessage ? (
        <Text style={styles.body}>{retryMessage}</Text>
      ) : null}

      <Button
        label={analyser.isStarting ? "Forging questions…" : "Begin analyser"}
        onPress={() => void analyser.start()}
        loading={analyser.isStarting}
        disabled={blockedByCooldown}
      />
      {status?.hasReport ? (
        <Button label="View last report" variant="secondary" onPress={() => setReportOpen(true)} />
      ) : null}
      <Button label="Back" variant="ghost" onPress={analyser.leave} />

      <ResultOverlay
        visible={Boolean(analyser.outcome) && !analyser.showHallOfFameUnlock && !reportOpen}
        tone="success"
        title={analyser.outcome?.tierLabel ?? ""}
        subtitle={
          analyser.outcome
            ? `Scored ${analyser.outcome.score}/${analyser.outcome.maxScore} in ${analyser.outcome.badge.realmName}.`
            : undefined
        }
        onRequestClose={analyser.leave}
        actions={
          <>
            <Button label="View report" onPress={() => setReportOpen(true)} />
            <Button label="Back to realm" variant="ghost" onPress={analyser.leave} />
          </>
        }
      />
      <UnlockOverlay
        kind={analyser.showHallOfFameUnlock ? "hallOfFame" : null}
        onDismiss={analyser.dismissUnlock}
      />
      {reportOpen ? (
        <ProgressReportSheet
          examId={examId}
          categoryId={categoryId}
          title={`${realmName} report`}
          onClose={() => setReportOpen(false)}
        />
      ) : null}
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
