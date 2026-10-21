import { StyleSheet, View } from "react-native";

import { radius, useTheme, type AppColors } from "@/app/theme";

type ProgressBarProps = {
  /** 0–100; values outside are clamped. */
  percent: number;
};

export function ProgressBar({ percent }: ProgressBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${clamped}%` }]} />
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  track: {
    height: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: 8, borderRadius: radius.sm, backgroundColor: colors.success },
});
}
