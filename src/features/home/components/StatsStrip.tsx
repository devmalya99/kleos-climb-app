import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

type StatsStripProps = {
  weekdayXp: number;
  weekendXp: number;
};

export function StatsStrip({ weekdayXp, weekendXp }: StatsStripProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const stats = [
    { label: "Weekday XP/day", value: weekdayXp },
    { label: "Weekend XP/day", value: weekendXp },
  ];

  return (
    <View style={styles.strip}>
      {stats.map((stat) => (
        <View key={stat.label} style={styles.stat}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  strip: {
    flexDirection: "row",
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  stat: { flex: 1, gap: 2 },
  value: {
    fontFamily: typography.bodyBold,
    fontSize: 22,
    letterSpacing: -0.3,
    color: colors.accent,
  },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.inkMuted,
  },
});
}
