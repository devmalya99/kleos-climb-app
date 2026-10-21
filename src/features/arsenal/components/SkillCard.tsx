import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { ProgressBar } from "@/shared/components/ProgressBar";

import type { PublicSkill } from "../types/arsenal.types";

export function SkillCard({ skill }: { skill: PublicSkill }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.name}>{skill.name}</Text>
        <Text style={styles.rank}>{skill.rankLabel.toUpperCase()}</Text>
      </View>
      <ProgressBar percent={skill.progressPercent} />
      <Text style={styles.meta}>
        {skill.xp.toLocaleString()} XP
        {skill.nextRankLabel && skill.xpToNextRank !== null
          ? ` · ${skill.xpToNextRank.toLocaleString()} to ${skill.nextRankLabel}`
          : " · Max rank"}
      </Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  name: { flex: 1, fontFamily: typography.bodyBold, fontSize: 16, color: colors.ink },
  rank: { fontFamily: typography.bodyBold, fontSize: 12, letterSpacing: 1, color: colors.success },
  meta: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
});
}
