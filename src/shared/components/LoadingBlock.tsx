import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";

type LoadingBlockProps = {
  label?: string;
};

export function LoadingBlock({ label = "Loading…" }: LoadingBlockProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.bg} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
  label: {
    fontFamily: typography.bodyMedium,
    color: colors.inkMuted,
    fontSize: 15,
  },
});
}
