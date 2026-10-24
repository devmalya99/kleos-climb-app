import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { groupNameSchema } from "../utils/clutter.schemas";

type FirstUnloadPromptProps = {
  saving: boolean;
  error: string | null;
  onSubmit: (name: string) => void;
  onDismiss: () => void;
};

/** First visit with zero buckets. Not now hides it until the next visit. */
export function FirstUnloadPrompt({ saving, error, onSubmit, onDismiss }: FirstUnloadPromptProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [name, setName] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  function submit() {
    const parsed = groupNameSchema.safeParse(name);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Name the topic");
      return;
    }
    setFieldError(null);
    onSubmit(parsed.data);
  }

  return (
    <SheetModal visible title="What's on your mind?" onClose={onDismiss}>
      <View style={styles.copy}>
        <Text style={styles.body}>Unload it here.</Text>
      </View>
      <TextField
        label="Topic"
        value={name}
        onChangeText={setName}
        autoCapitalize="sentences"
        error={fieldError ?? undefined}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Unload" onPress={submit} loading={saving} />
      <Button label="Not now" variant="ghost" onPress={onDismiss} />
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    copy: { gap: spacing.xs },
    body: { fontFamily: typography.body, fontSize: 16, lineHeight: 22, color: colors.inkMuted },
    error: { fontFamily: typography.bodyMedium, color: colors.danger },
  });
}
