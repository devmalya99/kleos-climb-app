import { useEffect, useState, type RefObject } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

import { CategoryBar } from "../components/CategoryBar";
import { CategoryNameSheet } from "../components/CategoryNameSheet";
import { ExpandTasksSheet } from "../components/ExpandTasksSheet";
import { FocusTimerSheet } from "../components/FocusTimerSheet";
import { ReviewTasksSheet } from "../components/ReviewTasksSheet";
import { TaskEditorSheet } from "../components/TaskEditorSheet";
import { TaskRow } from "../components/TaskRow";
import { TaskToolbar } from "../components/TaskToolbar";
import { useCategoryTasks } from "../hooks/useCategoryTasks";
import { useTaskCategories } from "../hooks/useTaskCategories";
import type { Task, TaskCategory } from "../types/taskManager.types";
import { taskChrome, type TaskChrome } from "../utils/taskChrome";

type Sheet =
  | { kind: "category"; category: TaskCategory | null }
  | { kind: "task"; task: Task | null }
  | { kind: "expand" }
  | { kind: "review" }
  | { kind: "focus"; task: Task }
  | null;

/** Rename and delete for the category controls beside Notes / Tasks. */
export type TaskCategoryActions = {
  rename: () => void;
  remove: () => void;
};

type TaskManagerScreenProps = {
  /** Opens this category when a search result is chosen. */
  focusCategoryId?: string | null;
  categoryActionsRef?: RefObject<TaskCategoryActions | null>;
  onCategoryEditableChange?: (editable: boolean) => void;
};

/** Tasks mode of the Clutter tab. AI expand/review always preview before saving. */
export function TaskManagerScreen({
  focusCategoryId = null,
  categoryActionsRef,
  onCategoryEditableChange,
}: TaskManagerScreenProps) {
  const { scheme } = useTheme();
  const chrome = taskChrome(scheme);
  const styles = createStyles(chrome);

  const categories = useTaskCategories();

  useEffect(() => {
    if (focusCategoryId) {
      categories.selectCategory(focusCategoryId);
    }
  }, [categories.selectCategory, focusCategoryId]);

  const active = categories.activeCategory;
  const tasks = useCategoryTasks(active?.id ?? null);
  const [sheet, setSheet] = useState<Sheet>(null);
  const editable = !categories.isLoading && !categories.loadError && Boolean(active);

  if (categoryActionsRef) {
    categoryActionsRef.current =
      editable && active
        ? {
            rename: () => {
              categories.clearError();
              tasks.clearError();
              setSheet({ kind: "category", category: active });
            },
            remove: () => {
              categories.clearError();
              categories.deleteCategory(active);
            },
          }
        : null;
  }

  useEffect(() => {
    onCategoryEditableChange?.(editable);
  }, [editable, onCategoryEditableChange]);

  useEffect(() => {
    return () => onCategoryEditableChange?.(false);
  }, [onCategoryEditableChange]);

  if (categories.isLoading) return <LoadingBlock label="Loading tasks…" />;

  if (categories.loadError) {
    return (
      <EmptyState
        title="Tasks unavailable"
        body={getErrorMessage(categories.loadError, "Could not load your task categories.")}
        actionLabel="Try again"
        onAction={() => void categories.refetch()}
      />
    );
  }

  function open(next: Sheet) {
    categories.clearError();
    tasks.clearError();
    setSheet(next);
  }

  async function submitCategory(name: string) {
    if (sheet?.kind !== "category") return;
    const result = sheet.category
      ? await categories.renameCategory(sheet.category.id, name)
      : await categories.createCategory(name);
    if (result.ok) setSheet(null);
  }

  async function submitTask(values: Parameters<typeof tasks.createTask>[0]) {
    if (sheet?.kind !== "task") return;
    const result = sheet.task
      ? await tasks.saveTask(sheet.task.id, values)
      : await tasks.createTask(values);
    if (result.ok) setSheet(null);
  }

  const inlineError = categories.error ?? tasks.error;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {categories.categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          body="Categories group your tasks. Create one to get started."
          actionLabel="New category"
          onAction={() => open({ kind: "category", category: null })}
        />
      ) : (
        <CategoryBar
          categories={categories.categories}
          activeId={active?.id ?? null}
          onSelect={categories.selectCategory}
          onAdd={() => open({ kind: "category", category: null })}
        />
      )}

      {inlineError && !sheet ? <Text style={styles.error}>{inlineError}</Text> : null}

      {active ? (
        <>
          <TaskToolbar
            categoryName={active.name}
            pendingCount={active.openTaskCount}
            reviewDisabled={tasks.tasks.length === 0}
            onNewTask={() => open({ kind: "task", task: null })}
            onExpand={() => open({ kind: "expand" })}
            onReview={() => open({ kind: "review" })}
          />

          {tasks.isLoading ? <LoadingBlock label="Loading tasks…" /> : null}
          {tasks.loadError ? (
            <Text style={styles.error}>{getErrorMessage(tasks.loadError, "Could not load tasks.")}</Text>
          ) : null}
          {!tasks.isLoading && !tasks.loadError && tasks.tasks.length === 0 ? (
            <EmptyState title="No tasks yet" body={`Add a task to “${active.name}”.`} />
          ) : null}

          <View style={styles.list}>
            {tasks.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => void tasks.toggleTask(task)}
                onEdit={() => open({ kind: "task", task })}
                onFocus={() => open({ kind: "focus", task })}
                onDelete={() => tasks.deleteTask(task)}
              />
            ))}
          </View>
        </>
      ) : null}

      {sheet?.kind === "category" ? (
        <CategoryNameSheet
          initialName={sheet.category?.name ?? null}
          saving={categories.isSaving}
          error={categories.error}
          onClose={() => setSheet(null)}
          onSubmit={(name) => void submitCategory(name)}
        />
      ) : null}
      {sheet?.kind === "task" ? (
        <TaskEditorSheet
          task={sheet.task}
          saving={tasks.isSaving}
          error={tasks.error}
          onClose={() => setSheet(null)}
          onSubmit={(values) => void submitTask(values)}
        />
      ) : null}
      {sheet?.kind === "expand" && active ? (
        <ExpandTasksSheet
          categoryId={active.id}
          categoryName={active.name}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet?.kind === "review" && active ? (
        <ReviewTasksSheet
          categoryId={active.id}
          tasks={tasks.tasks}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet?.kind === "focus" ? (
        <FocusTimerSheet
          task={sheet.task}
          onMarkDone={() => void tasks.toggleTask(sheet.task)}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </ScrollView>
  );
}

function createStyles(chrome: TaskChrome) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    content: { gap: spacing.md, paddingBottom: spacing.xxl },
    list: { gap: spacing.sm },
    error: { fontFamily: typography.bodyMedium, color: chrome.danger },
  });
}
