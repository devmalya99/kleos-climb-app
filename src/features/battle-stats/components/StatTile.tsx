import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

type StatTileProps = { label: string; value: string };

export function StatTile({ label, value }: StatTileProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  tile: {
    flexBasis: "47%",
    flexGrow: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
  },
  value: { fontFamily: typography.display, fontSize: 32, letterSpacing: 1, color: colors.accent },
  label: { fontFamily: typography.bodyMedium, fontSize: 12, color: colors.inkMuted },
});
}
