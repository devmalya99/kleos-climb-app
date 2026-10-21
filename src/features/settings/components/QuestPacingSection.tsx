import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { ListRow } from "@/shared/components/ListRow";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

import type { UserQuestPacing } from "../types/settings.types";

type QuestPacingSectionProps = {
  pacing: UserQuestPacing | null;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

export function QuestPacingSection({ pacing, isLoading, error, onRetry }: QuestPacingSectionProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (isLoading) return <LoadingBlock label="Loading pacing…" />;

  if (error || !pacing) {
    return (
      <EmptyState
        title="Pacing unavailable"
        body={getErrorMessage(error, "Could not load your quest pacing.")}
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  }

  const { questPacing, campaigns, questsCompletedToday } = pacing;

  return (
    <View style={styles.wrap}>
      <ListRow
        title={`Aim for ${questPacing.suggestedDailyQuests} quests a day`}
        subtitle={`${questPacing.questsPending} pending · ${questPacing.remainingDays} days left · minimum ${questPacing.requiredDailyQuests}/day`}
        right={`${questsCompletedToday} today`}
      />
      {campaigns.length === 0 ? (
        <Text style={styles.muted}>No campaigns with pending quests.</Text>
      ) : (
        campaigns.map((campaign) => (
          <ListRow
            key={campaign.examId}
            title={campaign.examName}
            subtitle={`${campaign.questsPending} pending · ${campaign.questsCompletedThisWeek} done this week`}
            right={`${campaign.questsCompletedToday}/${campaign.suggestedDailyQuests} today`}
          />
        ))
      )}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.sm },
  muted: { fontFamily: typography.body, fontSize: 14, color: colors.inkMuted },
});
}
