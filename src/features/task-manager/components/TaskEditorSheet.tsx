import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import type { Task } from "../types/taskManager.types";
import { taskFormSchema, type TaskFormValues } from "../utils/taskManager.schemas";

type TaskEditorSheetProps = {
  /** Task being edited; null creates a new one. Mount only while open so state resets. */
  task: Task | null;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
};

export function TaskEditorSheet({ task, saving, error, onClose, onSubmit }: TaskEditorSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [title, setTitle] = useState(task?.title ?? "");
  const [notes, setNotes] = useState(task?.notes ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSave() {
    const parsed = taskFormSchema.safeParse({ title, notes });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0] ?? "form")] ??= issue.message;
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
    onSubmit(parsed.data);
  }

  return (
    <SheetModal visible title={task ? "Edit task" : "New task"} onClose={onClose}>
      <TextField
        label="Title"
        value={title}
        onChangeText={setTitle}
        autoCapitalize="sentences"
        error={fieldErrors.title}
      />
      <TextField
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        autoCapitalize="sentences"
        multiline
        error={fieldErrors.notes}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={task ? "Save changes" : "Add task"} onPress={handleSave} loading={saving} />
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
