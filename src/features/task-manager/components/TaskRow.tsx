import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import type { Task } from "../types/taskManager.types";
import { taskChrome, taskIcon, type TaskChrome } from "../utils/taskChrome";

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onFocus: () => void;
  onDelete: () => void;
};

export function TaskRow({ task, onToggle, onEdit, onFocus, onDelete }: TaskRowProps) {
  const { scheme } = useTheme();
  const night = scheme === "dark";
  const chrome = taskChrome(scheme);
  const styles = createStyles(chrome, night);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <PressableScale
          accessibilityRole="checkbox"
          accessibilityLabel={`Mark ${task.title} ${task.isCompleted ? "open" : "done"}`}
          accessibilityState={{ checked: task.isCompleted }}
          hitSlop={8}
          pressedScale={0.9}
          onPress={onToggle}
          style={[styles.box, task.isCompleted ? styles.boxDone : null]}
        >
          {task.isCompleted ? <Text style={styles.tick}>✓</Text> : null}
        </PressableScale>
        <Text style={[styles.title, task.isCompleted ? styles.titleDone : null]}>{task.title}</Text>
      </View>
      {task.notes ? (
        <View style={styles.notesWell}>
          <Text style={styles.notes} numberOfLines={5}>
            {task.notes}
          </Text>
        </View>
      ) : null}
      <View style={styles.actions}>
        {task.isCompleted ? null : (
          <PressableScale accessibilityLabel="Focus" pressedScale={0.94} onPress={onFocus} style={styles.focus}>
            <SymbolView
              name={taskIcon(night ? "flame.fill" : "scope", night ? "local_fire_department" : "center_focus_strong")}
              tintColor={night ? chrome.focusInk : chrome.honey}
              size={14}
            />
            <Text style={styles.focusLabel}>{night ? "Enter Focus" : "Deep Focus"}</Text>
          </PressableScale>
        )}
        {night ? (
          <PressableScale
            accessibilityLabel={`Delete ${task.title}`}
            pressedScale={0.94}
            onPress={onDelete}
            style={styles.deleteText}
          >
            <SymbolView name={taskIcon("trash", "delete")} tintColor={chrome.danger} size={14} />
            <Text style={styles.deleteLabel}>Delete</Text>
          </PressableScale>
        ) : null}
        <View style={styles.spacer} />
        <PressableScale
          accessibilityLabel={`Edit ${task.title}`}
          hitSlop={6}
          pressedScale={0.9}
          onPress={onEdit}
          style={styles.iconButton}
        >
          <SymbolView name={taskIcon("ellipsis", "more_horiz")} tintColor={chrome.muted} size={16} />
        </PressableScale>
        {night ? null : (
          <PressableScale
            accessibilityLabel={`Delete ${task.title}`}
            hitSlop={6}
            pressedScale={0.9}
            onPress={onDelete}
            style={styles.trash}
          >
            <SymbolView name={taskIcon("trash", "delete")} tintColor={chrome.danger} size={15} />
          </PressableScale>
        )}
      </View>
    </View>
  );
}

function createStyles(chrome: TaskChrome, night: boolean) {
  return StyleSheet.create({
    card: {
      gap: spacing.md,
      backgroundColor: chrome.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: chrome.cardBorder,
      padding: spacing.md,
    },
    top: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
    box: {
      width: 22,
      height: 22,
      marginTop: 2,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: chrome.outline,
      alignItems: "center",
      justifyContent: "center",
    },
    boxDone: { backgroundColor: chrome.honey, borderColor: chrome.honey },
    tick: { color: chrome.honeyInk, fontFamily: typography.bodyBold, fontSize: 12 },
    title: { flex: 1, fontFamily: typography.bodyBold, fontSize: 17, letterSpacing: -0.2, color: chrome.ink },
    titleDone: { textDecorationLine: "line-through", color: chrome.muted },
    notesWell: {
      borderRadius: radius.md,
      backgroundColor: chrome.notesBg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
    },
    notes: { fontFamily: typography.body, fontSize: 13, lineHeight: 19, color: chrome.notesInk },
    actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    focus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      minHeight: 36,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      backgroundColor: night ? chrome.focus : chrome.honeySoft,
      borderWidth: night ? 0 : 1,
      borderColor: chrome.honey,
    },
    focusLabel: {
      fontFamily: typography.bodyBold,
      fontSize: 13,
      color: night ? chrome.focusInk : chrome.honeyInk,
    },
    deleteText: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      minHeight: 36,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      backgroundColor: chrome.dangerSoft,
    },
    deleteLabel: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.danger },
    spacer: { flex: 1 },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    trash: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.dangerSoft,
    },
  });
}
