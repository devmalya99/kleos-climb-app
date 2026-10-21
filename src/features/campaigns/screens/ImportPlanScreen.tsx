import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TextField } from "@/shared/components/TextField";

import { useImportPlan } from "../hooks/useImportPlan";

type ImportPlanScreenProps = {
  examId: string;
};

export function ImportPlanScreen({ examId }: ImportPlanScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const flow = useImportPlan(examId);

  if (flow.report) {
    const { report } = flow;
    return (
      <Screen scroll contentStyle={styles.content}>
        <ScreenHeader title="Import complete" showBack={false} />
        <Text style={styles.summary}>
          Added {report.totalQuestsAdded} {report.totalQuestsAdded === 1 ? "quest" : "quests"}
          {report.totalQuestsSkipped > 0
            ? `, skipped ${report.totalQuestsSkipped} that already existed`
            : ""}
          .
        </Text>
        {report.realms.map((realm) => (
          <View key={realm.name} style={styles.card}>
            <Text style={styles.realmName}>
              {realm.name}
              {realm.created ? " (new)" : ""}
            </Text>
            <Text style={styles.meta}>
              {realm.questsAdded.length} added · {realm.questsSkipped.length} skipped
            </Text>
          </View>
        ))}
        <Button label="Back to campaign" onPress={() => router.back()} />
      </Screen>
    );
  }

  if (flow.proposal) {
    return (
      <Screen scroll contentStyle={styles.content}>
        <ScreenHeader title="Review import" subtitle="Nothing is saved until you confirm." />
        {flow.previewMessage ? <Text style={styles.meta}>{flow.previewMessage}</Text> : null}
        {flow.proposal.realms.map((realm) => (
          <View key={realm.name} style={styles.card}>
            <Text style={styles.realmName}>{realm.name}</Text>
            {realm.quests.map((quest) => (
              <Text key={quest.name} style={styles.quest}>
                • {quest.name}
              </Text>
            ))}
          </View>
        ))}
        {flow.error ? <Text style={styles.error}>{flow.error}</Text> : null}
        <Button
          label="Confirm import"
          onPress={() => void flow.commit()}
          loading={flow.isCommitting}
        />
        <Button label="Edit plan" variant="ghost" onPress={flow.discardPreview} />
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Import plan" subtitle="Paste your syllabus or study plan." />
      <TextField
        label="Study plan"
        value={flow.text}
        onChangeText={flow.setText}
        autoCapitalize="sentences"
        multiline
        placeholder="Physics: Kinematics, Laws of Motion…"
        error={flow.error ?? undefined}
      />
      <Button
        label="Preview realms & quests"
        onPress={() => void flow.preview()}
        loading={flow.isPreviewing}
      />
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  summary: {
    fontFamily: typography.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  realmName: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  quest: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  meta: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSubtle,
  },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
