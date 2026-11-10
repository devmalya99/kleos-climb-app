import { SymbolView } from "expo-symbols";
import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Screen } from "@/shared/components/Screen";

import { TaskManagerScreen, type TaskCategoryActions } from "./TaskManagerScreen";
import { taskChrome, taskIcon } from "../utils/taskChrome";

type TasksScreenProps = {
  focusCategoryId?: string | null;
  onSearch: () => void;
};

/** Tasks tab. Category rename/delete and search are icon buttons. */
export function TasksScreen({ focusCategoryId = null, onSearch }: TasksScreenProps) {
  const { colors, scheme } = useTheme();
  const styles = createStyles(colors);
  const chrome = taskChrome(scheme);
  const [canEditCategory, setCanEditCategory] = useState(false);
  const categoryActionsRef = useRef<TaskCategoryActions | null>(null);
  const onCategoryEditableChange = useCallback((editable: boolean) => {
    setCanEditCategory(editable);
  }, []);

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.actions}>
          {canEditCategory ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rename category"
              onPress={() => categoryActionsRef.current?.rename()}
              style={styles.iconButton}
            >
              <SymbolView name={taskIcon("pencil", "edit")} tintColor={chrome.ink} size={16} />
            </Pressable>
          ) : null}
          {canEditCategory ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete category"
              onPress={() => categoryActionsRef.current?.remove()}
              style={[styles.iconButton, { backgroundColor: chrome.dangerSoft }]}
            >
              <SymbolView name={taskIcon("trash", "delete")} tintColor={chrome.danger} size={16} />
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search tasks"
            onPress={onSearch}
            style={styles.iconButton}
          >
            <SymbolView name={taskIcon("magnifyingglass", "search")} tintColor={chrome.ink} size={16} />
          </Pressable>
        </View>
      </View>
      <View style={styles.body}>
        <TaskManagerScreen
          focusCategoryId={focusCategoryId}
          categoryActionsRef={categoryActionsRef}
          onCategoryEditableChange={onCategoryEditableChange}
        />
      </View>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    content: { gap: spacing.md },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    title: {
      flexShrink: 1,
      fontFamily: typography.bodyBold,
      fontSize: 32,
      letterSpacing: -0.6,
      color: colors.ink,
    },
    actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.border,
    },
    body: { flex: 1 },
  });
}
