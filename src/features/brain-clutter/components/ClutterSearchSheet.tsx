import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { EmptyState } from "@/shared/components/EmptyState";
import { ListRow } from "@/shared/components/ListRow";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { useClutterSearch, type NoteSearchHit, type TaskSearchHit } from "../hooks/useClutterSearch";

type ClutterSearchSheetProps = {
  visible: boolean;
  /** Which list this tab searches. */
  scope?: "notes" | "tasks";
  onClose: () => void;
  onOpenNote: (groupId: string) => void;
  onOpenTask: (categoryId: string) => void;
};

export function ClutterSearchSheet({
  visible,
  scope = "notes",
  onClose,
  onOpenNote,
  onOpenTask,
}: ClutterSearchSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const search = useClutterSearch(visible);
  const hasQuery = search.query.trim().length > 0;
  const showNotes = scope === "notes";
  const showTasks = scope === "tasks";
  const noteResults = showNotes ? search.noteResults : [];
  const taskResults = showTasks ? search.taskResults : [];
  const subject = scope === "notes" ? "notes" : "tasks";

  return (
    <SheetModal visible={visible} title="Search" onClose={onClose}>
      <TextField
        label={scope === "notes" ? "Notes" : "Tasks"}
        value={search.query}
        onChangeText={search.setQuery}
        placeholder="Title or text"
        autoCapitalize="none"
      />
      {search.loading ? <LoadingBlock label={`Searching ${subject}…`} /> : null}
      {search.error ? <Text style={styles.error}>{search.error}</Text> : null}
      {!search.loading && !search.error && !hasQuery ? (
        <Text style={styles.hint}>Type to search your {subject}.</Text>
      ) : null}
      {!search.loading && hasQuery && noteResults.length === 0 && taskResults.length === 0 ? (
        <EmptyState title="No matches" body={`Nothing contains “${search.query.trim()}”.`} />
      ) : null}
      {noteResults.length > 0 ? (
        <ResultSection title="Notes" styles={styles}>
          {noteResults.map((note) => (
            <ListRow
              key={note.id}
              title={note.title || "Untitled note"}
              subtitle={subtitleForNote(note)}
              onPress={() => onOpenNote(note.groupId)}
            />
          ))}
        </ResultSection>
      ) : null}
      {taskResults.length > 0 ? (
        <ResultSection title="Tasks" styles={styles}>
          {taskResults.map((task) => (
            <ListRow
              key={task.id}
              title={task.title}
              subtitle={subtitleForTask(task)}
              onPress={() => onOpenTask(task.categoryId)}
            />
          ))}
        </ResultSection>
      ) : null}
    </SheetModal>
  );
}

function ResultSection({
  title,
  styles,
  children,
}: {
  title: string;
  styles: ReturnType<typeof createStyles>;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.list}>{children}</View>
    </View>
  );
}

function subtitleForNote(note: NoteSearchHit): string {
  const preview = note.content.trim();
  return preview ? `${note.groupName} · ${preview}` : note.groupName;
}

function subtitleForTask(task: TaskSearchHit): string {
  const preview = task.notes.trim();
  return preview ? `${task.categoryName} · ${preview}` : task.categoryName;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    hint: { fontFamily: typography.body, fontSize: 15, color: colors.inkMuted },
    error: { fontFamily: typography.bodyMedium, color: colors.danger },
    section: { gap: spacing.sm, maxHeight: 220 },
    sectionTitle: {
      fontFamily: typography.bodyBold,
      fontSize: 14,
      color: colors.inkSubtle,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    list: { flexGrow: 0 },
  });
}
