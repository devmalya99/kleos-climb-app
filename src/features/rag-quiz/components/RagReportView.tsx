import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import type { RagSession } from "../types/ragQuiz.types";

type RagReportViewProps = {
  session: RagSession;
  busy: boolean;
  noteSaved: boolean;
  error: string | null;
  onBuildReport: () => void;
  onSaveNote: () => void;
};

export function RagReportView({
  session,
  busy,
  noteSaved,
  error,
  onBuildReport,
  onSaveNote,
}: RagReportViewProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const hasReport = Boolean(session.reportStrong || session.reportWeak);

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader
        title="Quiz report"
        subtitle={`${session.topic} · ${session.accuracyPercent}% accuracy · ${session.correctCount} right, ${session.wrongCount} wrong`}
      />

      {hasReport ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Strong points</Text>
            <Text style={styles.body}>{session.reportStrong ?? "—"}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Weak points to improve</Text>
            <Text style={styles.body}>{session.reportWeak ?? "—"}</Text>
          </View>
        </>
      ) : (
        <Button label="Generate report" onPress={onBuildReport} loading={busy} />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {hasReport ? (
        <Button
          label={noteSaved ? "Saved to Brain Clutter" : "Save to Brain Clutter"}
          variant="secondary"
          onPress={onSaveNote}
          loading={busy}
          disabled={noteSaved}
        />
      ) : null}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  label: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  body: { fontFamily: typography.body, fontSize: 15, lineHeight: 22, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
