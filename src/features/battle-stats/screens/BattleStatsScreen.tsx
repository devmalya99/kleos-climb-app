import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { ListRow } from "@/shared/components/ListRow";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { isLockedError } from "@/shared/utils/isLockedError";

import { ExamAnalyticsPanel } from "../components/ExamAnalyticsPanel";
import { StatTile } from "../components/StatTile";
import { XpBarChart } from "../components/XpBarChart";
import {
  CHART_DAYS,
  FORECAST_STATUS_LABEL,
  PACING_STATUS_LABEL,
} from "../constants/battleStats.constants";
import { useAnalytics } from "../hooks/useBattleStats";

export function BattleStatsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const query = useAnalytics();
  const [examId, setExamId] = useState<string | null>(null);

  if (query.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading battle stats…" />
      </Screen>
    );
  }

  if (isLockedError(query.error)) {
    return (
      <Screen>
        <ScreenHeader title="Battle Stats" />
        <EmptyState
          title="Battle Stats is locked"
          body="Complete your first quest to unlock your progress and pacing charts."
        />
      </Screen>
    );
  }

  if (query.error || !query.data) {
    return (
      <Screen>
        <ScreenHeader title="Battle Stats" />
        <EmptyState
          title="Couldn't load Battle Stats"
          body={getErrorMessage(query.error)}
          actionLabel="Try again"
          onAction={() => void query.refetch()}
        />
      </Screen>
    );
  }

  const { summary, series, pacing, velocity, velocityForecast, campaignBreakdown } = query.data;

  if (summary.totalQuests === 0) {
    return (
      <Screen>
        <ScreenHeader title="Battle Stats" />
        <EmptyState
          title="Nothing to chart yet"
          body="Forge a campaign and add quests, then complete a few to see your progress."
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshing={query.isRefetching}
      onRefresh={() => void query.refetch()}
    >
      <ScreenHeader title="Battle Stats" subtitle={PACING_STATUS_LABEL[pacing.status]} />

      <View style={styles.grid}>
        <StatTile label="XP earned" value={summary.totalXpEarned.toLocaleString()} />
        <StatTile label="Quests done" value={`${summary.questsCompleted}/${summary.totalQuests}`} />
        <StatTile label="Current streak" value={`${summary.currentStreakDays}d`} />
        <StatTile label="Best streak" value={`${summary.bestStreakDays}d`} />
      </View>

      <Text style={styles.section}>Last {CHART_DAYS} days</Text>
      <XpBarChart points={series.slice(-CHART_DAYS)} />

      <Text style={styles.section}>Pace</Text>
      <ListRow
        title={FORECAST_STATUS_LABEL[velocityForecast.status]}
        subtitle={`${Math.round(velocity.avgXpPerDay)} XP/day over ${velocity.windowDays} days · need ${pacing.requiredDailyXp} XP/day`}
        right={`${summary.todayXpEarned} XP today`}
      />

      <Text style={styles.section}>Campaigns</Text>
      {campaignBreakdown.map((campaign) => (
        <ListRow
          key={campaign.examId}
          title={campaign.examName}
          subtitle={`${campaign.questsPending} quests pending · ${campaign.remainingDays} days left`}
          right={`${Math.round(campaign.percentComplete)}%`}
          onPress={() => setExamId(campaign.examId === examId ? null : campaign.examId)}
        />
      ))}
      {examId ? <ExamAnalyticsPanel examId={examId} /> : null}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  section: { fontFamily: typography.bodyBold, fontSize: 18, letterSpacing: -0.2, color: colors.ink, marginTop: spacing.sm },
});
}
