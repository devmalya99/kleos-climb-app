import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import { SUGGESTED_TASK_COPY } from "../constants/taskManager.constants";
import type { SuggestedTask } from "../types/taskManager.types";

type SuggestedTaskCardProps = {
  task: SuggestedTask;
  picking: boolean;
  error: string | null;
  onOpen: () => void;
  onAnother: () => void;
};

export function SuggestedTaskCard({
  task,
  picking,
  error,
  onOpen,
  onAnother,
}: SuggestedTaskCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const buttonLabel = picking ? SUGGESTED_TASK_COPY.picking : SUGGESTED_TASK_COPY.another;

  return (
    <View style={styles.card}>
      <PressableScale accessibilityLabel="Suggested task" onPress={onOpen} style={styles.task}>
        <Text style={styles.eyebrow}>{SUGGESTED_TASK_COPY.eyebrow}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {task.categoryName}
        </Text>
      </PressableScale>
      <PressableScale
        accessibilityLabel={buttonLabel}
        accessibilityState={{ disabled: picking }}
        disabled={picking}
        onPress={onAnother}
        style={[styles.button, picking ? styles.buttonBusy : null]}
      >
        <Text style={styles.buttonLabel}>{buttonLabel}</Text>
      </PressableScale>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceCard,
    },
    task: { gap: spacing.xs },
    eyebrow: {
      fontFamily: typography.bodyMedium,
      fontSize: 13,
      color: colors.inkMuted,
    },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 17,
      lineHeight: 22,
      color: colors.ink,
    },
    category: {
      fontFamily: typography.body,
      fontSize: 14,
      color: colors.inkSubtle,
    },
    button: {
      minHeight: 48,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.accentFill,
    },
    buttonBusy: { opacity: 0.55 },
    buttonLabel: {
      fontFamily: typography.bodyBold,
      fontSize: 15,
      color: colors.accentInk,
    },
    error: {
      fontFamily: typography.bodyMedium,
      fontSize: 13,
      color: colors.danger,
    },
  });
}
