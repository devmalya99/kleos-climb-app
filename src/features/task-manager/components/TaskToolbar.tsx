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

/** New-task row, AI actions, and the backlog heading. */
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
  const night = scheme === "dark";
  const chrome = taskChrome(scheme);
  const styles = createStyles(chrome);
  const pendingLabel = `${pendingCount} pending`;

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
          <SymbolView name={taskIcon("chevron.right", "chevron_right")} tintColor={chrome.ink} size={14} />
        </View>
      </View>

      <View style={styles.actionRow}>
        <ActionCard
          icon={taskIcon("sparkles", "auto_awesome")}
          kicker={night ? "Taurus AI" : "AI Boost"}
          title={night ? "Auto-expand" : "Expand with AI"}
          subtitle="Generate micro-steps"
          chrome={chrome}
          onPress={onExpand}
        />
        <ActionCard
          icon={taskIcon("checklist", "fact_check")}
          kicker={night ? "Review" : pendingLabel}
          title={night ? pendingLabel : "Review tasks"}
          subtitle="Suggest splits"
          chrome={chrome}
          disabled={reviewDisabled}
          onPress={onReview}
        />
        <ActionCard
          icon={taskIcon("arrow.up.arrow.down", "swap_vert")}
          kicker="AI"
          title="AI reorder"
          subtitle="Suggest a new order"
          chrome={chrome}
          disabled={reorderDisabled}
          onPress={onReorder}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionLabel}>{night ? "Active queue" : "Active backlog"}</Text>
          <View style={styles.sectionDot} />
        </View>
        <Text style={styles.sectionSort}>Sorted by priority</Text>
      </View>
    </View>
  );
}

function ActionCard({
  icon,
  kicker,
  title,
  subtitle,
  chrome,
  disabled = false,
  onPress,
}: {
  icon: ReturnType<typeof taskIcon>;
  kicker: string;
  title: string;
  subtitle: string;
  chrome: TaskChrome;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        actionStyles.card,
        { backgroundColor: chrome.card, borderColor: chrome.cardBorder },
        disabled ? actionStyles.disabled : null,
        pressed && !disabled ? actionStyles.pressed : null,
      ]}
    >
      <View style={actionStyles.top}>
        <View style={[actionStyles.iconWell, { backgroundColor: chrome.iconWell }]}>
          <SymbolView name={icon} tintColor={chrome.honey} size={14} />
        </View>
        <Text style={[actionStyles.kicker, { color: chrome.muted }]} numberOfLines={1}>
          {kicker}
        </Text>
      </View>
      <Text style={[actionStyles.title, { color: chrome.ink }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[actionStyles.subtitle, { color: chrome.muted }]} numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const actionStyles = StyleSheet.create({
  card: {
    flex: 1,
    gap: 6,
    minHeight: 108,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  iconWell: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  kicker: { flexShrink: 1, fontFamily: typography.bodyMedium, fontSize: 11 },
  title: { fontFamily: typography.bodyBold, fontSize: 15, letterSpacing: -0.2 },
  subtitle: { fontFamily: typography.body, fontSize: 12 },
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
      maxWidth: 132,
      minHeight: 52,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: chrome.outline,
      backgroundColor: chrome.card,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: spacing.md,
    },
    categoryPillLabel: { flexShrink: 1, fontFamily: typography.bodyBold, fontSize: 14, color: chrome.ink },
    actionRow: { flexDirection: "row", gap: spacing.sm },
    section: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
    sectionTitle: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
    sectionLabel: {
      fontFamily: typography.bodyBold,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: chrome.muted,
    },
    sectionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: chrome.honey },
    sectionSort: { fontFamily: typography.body, fontSize: 12, color: chrome.muted },
  });
}
