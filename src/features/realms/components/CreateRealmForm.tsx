import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";
import { getErrorMessage } from "@/services/api";

import { realmNameSchema } from "../utils/realm.schemas";

type CreateRealmFormProps = {
  saving: boolean;
  /** Rejects when the server refuses; the form shows the message and keeps the input. */
  onCreate: (realmName: string) => Promise<unknown>;
};

export function CreateRealmForm({ saving, onCreate }: CreateRealmFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const parsed = realmNameSchema.safeParse(name);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid realm name");
      return;
    }
    setError(null);
    try {
      await onCreate(parsed.data);
      setName("");
    } catch (err) {
      setError(getErrorMessage(err, "Could not create realm"));
    }
  }

  return (
    <View style={styles.wrap}>
      <TextField
        label="New realm"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Organic Chemistry"
        autoCapitalize="words"
        error={error ?? undefined}
      />
      <Button label="Add realm" variant="secondary" onPress={handleSubmit} loading={saving} />
      <Text style={styles.hint}>Realms are the subjects inside a campaign.</Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.sm },
  hint: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSubtle,
  },
});
}
