import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";

import { Button } from "./Button";

type EmptyStateProps = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.inkMuted,
    lineHeight: 24,
  },
  button: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
  },
});
}
