import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { ChipButton } from "@/shared/components/ChipButton";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { useNoteRewrite } from "../hooks/useNoteRewrite";
import type { ClutterNote } from "../types/brainClutter.types";
import { noteFormSchema, type NoteFormValues } from "../utils/clutter.schemas";

import { RewritePreviewPanel } from "./RewritePreviewPanel";

type NoteEditorSheetProps = {
  /** Note being edited; null creates a new one. Mount only while open so state resets. */
  note: ClutterNote | null;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => void;
  onDelete?: () => void;
};

export function NoteEditorSheet({
  note,
  saving,
  error,
  onClose,
  onSubmit,
  onDelete,
}: NoteEditorSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [isTask, setIsTask] = useState(note?.isTask ?? false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const rewrite = useNoteRewrite();

  const canRewrite = title.trim().length > 0 || content.trim().length > 0;

  function handleSave() {
    const parsed = noteFormSchema.safeParse({ title, content, isTask });
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

  function applyRewrite() {
    if (!rewrite.preview) return;
    setTitle(rewrite.preview.title);
    setContent(rewrite.preview.content);
    rewrite.discard();
  }

  return (
    <SheetModal visible title={note ? "Edit note" : "New note"} onClose={onClose}>
      <TextField
        label="Title"
        value={title}
        onChangeText={setTitle}
        autoCapitalize="sentences"
        error={fieldErrors.title}
      />
      <TextField
        label="Content"
        value={content}
        onChangeText={setContent}
        autoCapitalize="sentences"
        multiline
        error={fieldErrors.content}
      />
      <ChipButton
        label={isTask ? "Marked as task" : "Mark as task"}
        active={isTask}
        onPress={() => setIsTask((value) => !value)}
      />

      {rewrite.preview ? (
        <RewritePreviewPanel
          preview={rewrite.preview}
          onApply={applyRewrite}
          onDiscard={rewrite.discard}
        />
      ) : (
        <Button
          label="Rewrite with AI"
          variant="ghost"
          loading={rewrite.isRewriting}
          disabled={!canRewrite}
          onPress={() => void rewrite.requestRewrite({ title, content })}
        />
      )}
      {rewrite.error ? <Text style={styles.error}>{rewrite.error}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label={note ? "Save changes" : "Add note"}
        onPress={handleSave}
        loading={saving}
        disabled={Boolean(rewrite.preview)}
      />
      {note && onDelete ? <Button label="Delete note" variant="danger" onPress={onDelete} /> : null}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
