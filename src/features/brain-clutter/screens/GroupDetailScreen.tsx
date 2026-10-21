import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import { NoteEditorSheet } from "../components/NoteEditorSheet";
import { NoteRow } from "../components/NoteRow";
import { useClutterGroupDetail } from "../hooks/useClutterGroupDetail";
import type { ClutterNote } from "../types/brainClutter.types";
import type { NoteFormValues } from "../utils/clutter.schemas";

type GroupDetailScreenProps = {
  groupId: string;
};

export function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const detail = useClutterGroupDetail(groupId);
  // `null` = closed, `"new"` = create, otherwise the note being edited.
  const [editor, setEditor] = useState<ClutterNote | "new" | null>(null);

  if (detail.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading notes…" />
      </Screen>
    );
  }

  if (detail.loadError || !detail.group) {
    return (
      <Screen>
        <ScreenHeader title="Bucket" />
        <EmptyState
          title="Bucket unavailable"
          body={getErrorMessage(detail.loadError, "This bucket could not be loaded.")}
          actionLabel="Try again"
          onAction={() => void detail.refetch()}
        />
      </Screen>
    );
  }

  async function handleSubmit(values: NoteFormValues) {
    const result =
      editor && editor !== "new"
        ? await detail.saveNote(editor.id, values)
        : await detail.createNote(values);
    if (result.ok) setEditor(null);
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader
        title={detail.group.name}
        subtitle={`${detail.notes.length} ${detail.notes.length === 1 ? "note" : "notes"}`}
      />
      <Button
        label="New note"
        onPress={() => {
          detail.clearError();
          setEditor("new");
        }}
      />
      {detail.error && !editor ? <Text style={styles.error}>{detail.error}</Text> : null}

      {detail.notes.length === 0 ? (
        <EmptyState title="No notes yet" body="Add your first note to this bucket." />
      ) : (
        <View style={styles.list}>
          {detail.notes.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              onPress={() => {
                detail.clearError();
                setEditor(note);
              }}
              onToggleCompleted={() => void detail.toggleCompleted(note)}
            />
          ))}
        </View>
      )}

      {editor ? (
        <NoteEditorSheet
          note={editor === "new" ? null : editor}
          saving={detail.isSaving}
          error={detail.error}
          onClose={() => setEditor(null)}
          onSubmit={(values) => void handleSubmit(values)}
          onDelete={
            editor === "new"
              ? undefined
              : () => detail.deleteNote(editor, () => setEditor(null))
          }
        />
      ) : null}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  list: { gap: spacing.sm },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
