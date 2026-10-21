import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

import type { XpProgressPoint } from "../types/battleStats.types";

const BAR_AREA_HEIGHT = 120;

/** Daily XP bars. Plain Views — no chart dependency. */
export function XpBarChart({ points }: { points: XpProgressPoint[] }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const max = Math.max(1, ...points.map((point) => point.dailyXp));

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {points.map((point) => (
          <View key={point.date} style={styles.column}>
            <View
              accessibilityLabel={`${point.label}: ${point.dailyXp} XP`}
              style={[
                styles.bar,
                { height: Math.max(point.dailyXp > 0 ? 4 : 2, (point.dailyXp / max) * BAR_AREA_HEIGHT) },
                point.dailyXp === 0 ? styles.barEmpty : null,
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisLabel}>{points[0]?.label}</Text>
        <Text style={styles.axisLabel}>Peak {max} XP</Text>
        <Text style={styles.axisLabel}>{points[points.length - 1]?.label}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.xs },
  bars: { height: BAR_AREA_HEIGHT, flexDirection: "row", alignItems: "flex-end", gap: 3 },
  column: { flex: 1, justifyContent: "flex-end" },
  bar: { backgroundColor: colors.success, borderTopLeftRadius: radius.sm, borderTopRightRadius: radius.sm },
  barEmpty: { backgroundColor: colors.border },
  axis: { flexDirection: "row", justifyContent: "space-between" },
  axisLabel: { fontFamily: typography.body, fontSize: 11, color: colors.inkSubtle },
});
}
