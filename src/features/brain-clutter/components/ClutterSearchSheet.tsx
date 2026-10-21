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
  onClose: () => void;
  onOpenNote: (groupId: string) => void;
  onOpenTask: (categoryId: string) => void;
};

export function ClutterSearchSheet({
  visible,
  onClose,
  onOpenNote,
  onOpenTask,
}: ClutterSearchSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const search = useClutterSearch(visible);
  const hasQuery = search.query.trim().length > 0;

  return (
    <SheetModal visible={visible} title="Search" onClose={onClose}>
      <TextField
        label="Notes and tasks"
        value={search.query}
        onChangeText={search.setQuery}
        placeholder="Title or text"
        autoCapitalize="none"
      />
      {search.loading ? <LoadingBlock label="Searching notes and tasks…" /> : null}
      {search.error ? <Text style={styles.error}>{search.error}</Text> : null}
      {!search.loading && !search.error && !hasQuery ? (
        <Text style={styles.hint}>Type to search every note and task.</Text>
      ) : null}
      {!search.loading && hasQuery && search.noteResults.length === 0 && search.taskResults.length === 0 ? (
        <EmptyState title="No matches" body={`Nothing contains “${search.query.trim()}”.`} />
      ) : null}
      {search.noteResults.length > 0 ? (
        <ResultSection title="Notes" styles={styles}>
          {search.noteResults.map((note) => (
            <ListRow
              key={note.id}
              title={note.title || "Untitled note"}
              subtitle={subtitleForNote(note)}
              onPress={() => onOpenNote(note.groupId)}
            />
          ))}
        </ResultSection>
      ) : null}
      {search.taskResults.length > 0 ? (
        <ResultSection title="Tasks" styles={styles}>
          {search.taskResults.map((task) => (
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
