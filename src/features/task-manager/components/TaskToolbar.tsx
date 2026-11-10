import { Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { radius, spacing, typography, useTheme } from "@/app/theme";

import { taskChrome, taskIcon, type TaskChrome } from "../utils/taskChrome";

type TaskToolbarProps = {
  categoryName: string;
  pendingCount: number;
  reviewDisabled: boolean;
  reorderDisabled: boolean;
  onNewTask: () => void;
  onExpand: () => void;
  onReview: () => void;
  onReorder: () => void;
};

/** New-task row and icon actions for expand, review, and reorder. */
export function TaskToolbar({
  categoryName,
  pendingCount,
  reviewDisabled,
  reorderDisabled,
  onNewTask,
  onExpand,
  onReview,
  onReorder,
}: TaskToolbarProps) {
  const { scheme } = useTheme();
  const chrome = taskChrome(scheme);
  const styles = createStyles(chrome);

  return (
    <View style={styles.wrap}>
      <View style={styles.createRow}>
        <Pressable accessibilityRole="button" onPress={onNewTask} style={styles.newTask}>
          <SymbolView name={taskIcon("plus", "add")} tintColor={chrome.honeyInk} size={16} />
          <Text style={styles.newTaskLabel}>New task</Text>
        </Pressable>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillLabel} numberOfLines={1}>
            {categoryName}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <IconAction
          label="Expand with AI"
          icon={taskIcon("sparkles", "auto_awesome")}
          chrome={chrome}
          onPress={onExpand}
        />
        <IconAction
          label={`Review ${pendingCount} open tasks`}
          icon={taskIcon("checklist", "fact_check")}
          chrome={chrome}
          disabled={reviewDisabled}
          onPress={onReview}
        />
        <IconAction
          label="AI reorder"
          icon={taskIcon("arrow.up.arrow.down", "swap_vert")}
          chrome={chrome}
          disabled={reorderDisabled}
          onPress={onReorder}
        />
      </View>

      <Text style={styles.sectionLabel}>Active backlog</Text>
    </View>
  );
}

function IconAction({
  label,
  icon,
  chrome,
  disabled = false,
  onPress,
}: {
  label: string;
  icon: ReturnType<typeof taskIcon>;
  chrome: TaskChrome;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        iconStyles.button,
        { backgroundColor: chrome.card, borderColor: chrome.cardBorder },
        disabled ? iconStyles.disabled : null,
        pressed && !disabled ? iconStyles.pressed : null,
      ]}
    >
      <SymbolView name={icon} tintColor={chrome.honey} size={18} />
    </Pressable>
  );
}

const iconStyles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85 },
});

function createStyles(chrome: TaskChrome) {
  return StyleSheet.create({
    wrap: { gap: spacing.md },
    createRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    newTask: {
      flex: 1,
      minHeight: 52,
      borderRadius: radius.pill,
      backgroundColor: chrome.honey,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingHorizontal: spacing.md,
    },
    newTaskLabel: { fontFamily: typography.bodyBold, fontSize: 16, color: chrome.honeyInk },
    categoryPill: {
      maxWidth: 140,
      minHeight: 52,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: chrome.outline,
      backgroundColor: chrome.card,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
    },
    categoryPillLabel: { fontFamily: typography.bodyBold, fontSize: 14, color: chrome.ink },
    actionRow: { flexDirection: "row", gap: spacing.sm },
    sectionLabel: {
      fontFamily: typography.bodyBold,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: chrome.muted,
    },
  });
}
