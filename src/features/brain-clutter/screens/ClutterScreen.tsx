import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { TaskManagerScreen, type TaskCategoryActions } from "@/features/task-manager";
import { Screen } from "@/shared/components/Screen";

import { ClutterModeSwitch } from "../components/ClutterModeSwitch";
import { ClutterSearchSheet } from "../components/ClutterSearchSheet";
import { GroupsPanel } from "../components/GroupsPanel";
import type { ClutterMode } from "../constants/brainClutter.constants";

/** Clutter tab: switch between the Notes workspace and the Task Manager. */
export function ClutterScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const params = useLocalSearchParams<{ mode?: string | string[]; request?: string | string[] }>();
  const requestedMode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const requestId = Array.isArray(params.request) ? params.request[0] : params.request;
  const [mode, setMode] = useState<ClutterMode>(requestedMode === "tasks" ? "tasks" : "notes");

  useEffect(() => {
    if (requestedMode !== "tasks" || !requestId) return;
    setMode("tasks");
  }, [requestedMode, requestId]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [taskCategoryId, setTaskCategoryId] = useState<string | null>(null);
  const [canEditCategory, setCanEditCategory] = useState(false);
  const [unloadDismissed, setUnloadDismissed] = useState(false);
  const categoryActionsRef = useRef<TaskCategoryActions | null>(null);
  const onCategoryEditableChange = useCallback((editable: boolean) => {
    setCanEditCategory(editable);
  }, []);
  const showCategoryActions = mode === "tasks" && canEditCategory;

  useFocusEffect(
    useCallback(() => {
      return () => setUnloadDismissed(false);
    }, []),
  );

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Clutter</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          onPress={() => setSearchOpen(true)}
          style={styles.search}
        >
          <Text style={styles.searchLabel}>Search</Text>
        </Pressable>
      </View>
      <ClutterModeSwitch
        mode={mode}
        onChange={setMode}
        onRename={showCategoryActions ? () => categoryActionsRef.current?.rename() : undefined}
        onDelete={showCategoryActions ? () => categoryActionsRef.current?.remove() : undefined}
      />
      <View style={styles.body}>
        {mode === "notes" ? (
          <GroupsPanel
            showFirstUnload={!unloadDismissed}
            onDismissFirstUnload={() => setUnloadDismissed(true)}
          />
        ) : (
          <TaskManagerScreen
            focusCategoryId={taskCategoryId}
            categoryActionsRef={categoryActionsRef}
            onCategoryEditableChange={onCategoryEditableChange}
          />
        )}
      </View>
      <ClutterSearchSheet
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenNote={(groupId) => {
          setSearchOpen(false);
          router.push(`/clutter/${groupId}`);
        }}
        onOpenTask={(categoryId) => {
          setSearchOpen(false);
          setMode("tasks");
          setTaskCategoryId(categoryId);
        }}
      />
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    content: { gap: spacing.md },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
    title: {
      flexShrink: 1,
      fontFamily: typography.bodyBold,
      fontSize: 32,
      letterSpacing: -0.6,
      color: colors.ink,
    },
    search: {
      minHeight: 36,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceCard,
      alignItems: "center",
      justifyContent: "center",
    },
    searchLabel: {
      fontFamily: typography.bodyMedium,
      fontSize: 14,
      color: colors.ink,
    },
    body: { flex: 1 },
  });
}
