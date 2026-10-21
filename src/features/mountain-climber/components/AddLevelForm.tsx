import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";

import { levelDescriptionSchema, levelTitleSchema } from "../utils/climb.schemas";

type AddLevelFormProps = {
  onAdd: (title: string, description: string) => void;
  onCancel: () => void;
};

export function AddLevelForm({ onAdd, onCancel }: AddLevelFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
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
    setError(null);
    onAdd(parsedTitle.data, parsedDescription.data);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Add a task</Text>
      <TextField
        label="Task"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Finish the system design notes"
        autoCapitalize="sentences"
      />
      <TextField
        label="Note (optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="What does done look like?"
        autoCapitalize="sentences"
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Add task" onPress={submit} />
      <Button label="Cancel" variant="ghost" onPress={onCancel} />
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: { gap: spacing.md },
    kicker: {
      fontFamily: typography.bodyBold,
      fontSize: 20,
      letterSpacing: -0.2,
      color: colors.ink,
    },
    error: {
      fontFamily: typography.bodyMedium,
      color: colors.danger,
    },
  });
}
