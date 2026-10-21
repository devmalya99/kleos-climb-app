import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";

import type { PublicProgressReport } from "../types/levelAnalyser.types";

export function ProgressReportView({ report }: { report: PublicProgressReport }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <Text style={styles.tier}>{report.tierLabel}</Text>
      <Text style={styles.score}>
        {report.score}/{report.maxScore} · compiled {new Date(report.compiledAt).toLocaleDateString()}
      </Text>
      <Text selectable style={styles.text}>
        {report.reportText}
      </Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.sm },
  tier: { fontFamily: typography.display, fontSize: 36, letterSpacing: 1, color: colors.ink },
  score: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.inkMuted },
  text: { fontFamily: typography.body, fontSize: 15, lineHeight: 23, color: colors.ink },
});
}
