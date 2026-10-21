import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { ProgressBar } from "@/shared/components/ProgressBar";

import { PACING_STATUS_LABEL } from "../constants/battleStats.constants";
import { useExamAnalytics } from "../hooks/useBattleStats";

/** Per-campaign detail: pacing plus per-realm completion. */
export function ExamAnalyticsPanel({ examId }: { examId: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const query = useExamAnalytics(examId);

  if (query.isLoading) return <LoadingBlock label="Loading campaign stats…" />;

  if (query.error || !query.data) {
    return (
      <EmptyState
        title="Campaign stats unavailable"
        body={getErrorMessage(query.error)}
        actionLabel="Try again"
        onAction={() => void query.refetch()}
      />
    );
  }

  const exam = query.data;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{exam.examName}</Text>
      <Text style={styles.body}>
        {PACING_STATUS_LABEL[exam.pacing.status]} · suggested {exam.pacing.suggestedDailyXp} XP/day ·{" "}
        {exam.pacing.remainingDays} days left
      </Text>
      <Text style={styles.body}>
        {exam.completedTopicCount}/{exam.topicCount} quests · {exam.xpEarned}/{exam.xpTotal} XP
      </Text>
      <ProgressBar percent={exam.percentComplete} />

      {exam.categoryBreakdown.map((realm) => (
        <View key={realm.categoryName} style={styles.realm}>
          <Text style={styles.realmName}>
            {realm.categoryName} · {realm.completed}/{realm.total}
          </Text>
          <ProgressBar percent={realm.xpTotal > 0 ? (realm.xpEarned / realm.xpTotal) * 100 : 0} />
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.sm },
  title: { fontFamily: typography.bodyBold, fontSize: 18, letterSpacing: -0.2, color: colors.ink },
  body: { fontFamily: typography.body, fontSize: 14, color: colors.inkMuted },
  realm: { gap: 4 },
  realmName: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.ink },
});
}
