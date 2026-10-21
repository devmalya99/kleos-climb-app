import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { CreateRealmForm, RealmCard } from "@/features/realms";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import { CampaignFormSheet } from "../components/CampaignFormSheet";
import { useCampaignDetail } from "../hooks/useCampaignDetail";
import { daysUntil, describeDaysLeft, formatTargetDate } from "../utils/campaignDates";

type CampaignDetailScreenProps = {
  examId: string;
};

export function CampaignDetailScreen({ examId }: CampaignDetailScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const detail = useCampaignDetail(examId);
  const { exam } = detail;

  if (detail.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading campaign…" />
      </Screen>
    );
  }

  if (detail.loadError || !exam) {
    return (
      <Screen>
        <ScreenHeader title="Campaign" />
        <EmptyState
          title="Campaign unavailable"
          body={getErrorMessage(detail.loadError, "This campaign could not be loaded.")}
          actionLabel="Try again"
          onAction={detail.retry}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader
        title={exam.name}
        subtitle={`Target ${formatTargetDate(exam.targetDate)} · ${describeDaysLeft(daysUntil(exam.targetDate))}`}
      />

      <Button label="Import study plan" onPress={detail.openImport} />

      <Text style={styles.section}>Realms</Text>
      <CreateRealmForm saving={detail.isCreatingRealm} onCreate={detail.createRealm} />

      {detail.realms.length === 0 ? (
        <EmptyState
          title="No realms yet"
          body="Add a realm above, or import a study plan to create realms and quests at once."
        />
      ) : (
        <View style={styles.list}>
          {detail.realms.map((realm) => (
            <RealmCard
              key={realm.id}
              realm={realm}
              questCount={detail.questCountByRealm.get(realm.id) ?? 0}
              tierLabel={detail.statuses[realm.id]?.tierLabel}
              onPress={() => detail.openRealm(realm.id)}
            />
          ))}
        </View>
      )}

      {detail.error ? <Text style={styles.error}>{detail.error}</Text> : null}

      <View style={styles.footer}>
        <Button label="Edit campaign" variant="ghost" onPress={() => detail.setEditing(true)} />
        <Button label="Delete campaign" variant="danger" onPress={detail.deleteCampaign} />
      </View>

      {detail.editing ? (
        <CampaignFormSheet campaign={exam} onClose={() => detail.setEditing(false)} />
      ) : null}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  section: {
    fontFamily: typography.bodyBold,
    fontSize: 18,
    letterSpacing: -0.2,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  list: { gap: spacing.sm },
  footer: { gap: spacing.sm, marginTop: spacing.md },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
