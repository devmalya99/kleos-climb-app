import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import type { ClimbLevel } from "../types/climb.types";
import { levelDescriptionSchema, levelTitleSchema } from "../utils/climb.schemas";
import { TaskProgressSlider } from "./TaskProgressSlider";

export type LevelStatus = "cleared" | "current" | "ahead";

type CampSheetProps = {
  visible: boolean;
  level: ClimbLevel;
  levelNumber: number;
  status: LevelStatus;
  isLastCleared: boolean;
  canRemove: boolean;
  onClose: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRemove: () => void;
  onEdit: (title: string, description: string) => void;
  onProgress: (progress: number) => void;
};

export function CampSheet({
  visible,
  level,
  levelNumber,
  status,
  isLastCleared,
  canRemove,
  onClose,
  onClear,
  onUndo,
  onRemove,
  onEdit,
  onProgress,
}: CampSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(level.title);
  const [description, setDescription] = useState(level.description);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setTitle(level.title);
    setDescription(level.description);
    setError(null);
    setIsEditing(true);
  }

  function saveEdit() {
    const parsedTitle = levelTitleSchema.safeParse(title);
    if (!parsedTitle.success) {
      setError(parsedTitle.error.issues[0]?.message ?? "Give this task a name");
      return;
    }
    const parsedDescription = levelDescriptionSchema.safeParse(description);
    if (!parsedDescription.success) {
      setError(parsedDescription.error.issues[0]?.message ?? "Shorten the note");
      return;
    }
    onEdit(parsedTitle.data, parsedDescription.data);
    setIsEditing(false);
  }

  const statusLabel =
    status === "current" ? "You are here" : status === "cleared" ? "Cleared" : "Ahead";

  return (
    <SheetModal visible={visible} title={`Camp ${levelNumber}`} onClose={onClose}>
      <Text style={styles.status}>{statusLabel}</Text>
      {isEditing ? (
        <View style={styles.edit}>
          <TextField label="Task" value={title} onChangeText={setTitle} autoCapitalize="sentences" />
          <TextField
            label="Note (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optional)"
            autoCapitalize="sentences"
            multiline
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Save" onPress={saveEdit} />
          <Button label="Cancel" variant="ghost" onPress={() => setIsEditing(false)} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>{level.title}</Text>
          {level.description ? <Text style={styles.note}>{level.description}</Text> : null}
        </>
      )}

      {status === "current" ? (
        <TaskProgressSlider
          taskTitle={level.title}
          progress={level.progress}
          disabled={false}
          onCommit={onProgress}
        />
      ) : null}

      {!isEditing ? (
        <View style={styles.actions}>
          {status === "current" ? (
            <Button
              label="Clear camp"
              onPress={() => {
                void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onClear();
                onClose();
              }}
            />
          ) : null}
          {isLastCleared ? (
            <Button
              label="Undo clear"
              variant="secondary"
              onPress={() => {
                onUndo();
                onClose();
              }}
            />
          ) : null}
          <Button label="Edit" variant="secondary" onPress={startEditing} />
          {canRemove ? (
            <Button
              label="Delete camp"
              variant="danger"
              onPress={() => {
                onRemove();
                onClose();
              }}
            />
          ) : null}
        </View>
      ) : null}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    status: {
      fontFamily: typography.bodyMedium,
      fontSize: 12,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: colors.inkMuted,
    },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 20,
      color: colors.ink,
    },
    note: {
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 22,
      color: colors.inkMuted,
    },
    edit: { gap: spacing.sm },
    error: { fontFamily: typography.bodyMedium, color: colors.danger },
    actions: { gap: spacing.sm },
  });
}
