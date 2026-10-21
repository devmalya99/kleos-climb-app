import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import type { ClutterGroup } from "../types/brainClutter.types";

type GroupCardProps = {
  group: ClutterGroup;
  onOpen: () => void;
  onTogglePin: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function GroupCard({ group, onOpen, onTogglePin, onRename, onDelete }: GroupCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <PressableScale onPress={onOpen} style={styles.main}>
        <View style={styles.copy}>
          <Text style={styles.title}>{group.name}</Text>
          <Text style={styles.meta}>
            {group.noteCount} {group.noteCount === 1 ? "note" : "notes"}
            {group.isPinned ? " · Pinned" : ""}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </PressableScale>
      <View style={styles.actions}>
        {(
          [
            { label: group.isPinned ? "Unpin" : "Pin", onPress: onTogglePin, danger: false },
            { label: "Rename", onPress: onRename, danger: false },
            { label: "Delete", onPress: onDelete, danger: true },
          ] as const
        ).map((action) => (
          <PressableScale
            key={action.label}
            pressedScale={0.94}
            onPress={action.onPress}
            style={[styles.chip, action.danger ? styles.chipDanger : null]}
          >
            <Text style={[styles.chipLabel, action.danger ? styles.chipLabelDanger : null]}>{action.label}</Text>
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  main: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  copy: { flex: 1, gap: 4 },
  title: { fontFamily: typography.bodyBold, fontSize: 17, color: colors.ink },
  meta: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.inkSubtle },
  chevron: { fontFamily: typography.bodyBold, fontSize: 22, color: colors.inkSubtle },
  actions: { flexDirection: "row", gap: spacing.sm },
  chip: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  chipDanger: { borderColor: colors.danger },
  chipLabel: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.ink },
  chipLabelDanger: { color: colors.danger },
});
}
