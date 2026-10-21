import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";
import type { PublicTopic, TopicPriority } from "@/shared/types/study.types";

import { QUEST_PRIORITIES } from "../constants/quests.constants";
import { parseResourcesText, questFormSchema } from "../utils/quest.schemas";

export type QuestFormValues = {
  name: string;
  description: string;
  priority: TopicPriority;
  resources: string[];
};

type QuestEditorSheetProps = {
  /** Quest being edited; null creates a new one. Mount only while open so state resets. */
  quest: PublicTopic | null;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: QuestFormValues) => void;
};

export function QuestEditorSheet({
  quest,
  saving,
  error,
  onClose,
  onSubmit,
}: QuestEditorSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState(quest?.name ?? "");
  const [description, setDescription] = useState(quest?.description ?? "");
  const [priority, setPriority] = useState<TopicPriority>(quest?.priority ?? "MEDIUM");
  const [resourcesText, setResourcesText] = useState(quest?.resources.join("\n") ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSave() {
    const parsed = questFormSchema.safeParse({
      name,
      description,
      priority,
      resources: parseResourcesText(resourcesText),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] ??= issue.message;
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
    onSubmit(parsed.data);
  }

  return (
    <SheetModal visible title={quest ? "Edit quest" : "New quest"} onClose={onClose}>
      <TextField
        label="Quest name"
        value={name}
        onChangeText={setName}
        autoCapitalize="sentences"
        error={fieldErrors.name}
      />
      <TextField
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        autoCapitalize="sentences"
        multiline
        error={fieldErrors.description}
      />
      <View style={styles.priorityWrap}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {QUEST_PRIORITIES.map((option) => {
            const active = option.value === priority;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setPriority(option.value)}
                style={[styles.chip, active ? styles.chipActive : null]}
              >
                <Text style={[styles.chipLabel, active ? styles.chipLabelActive : null]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <TextField
        label="Resource links (one URL per line)"
        value={resourcesText}
        onChangeText={setResourcesText}
        multiline
        error={fieldErrors.resources}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label={quest ? "Save changes" : "Add quest"} onPress={handleSave} loading={saving} />
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  priorityWrap: { gap: spacing.xs },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.inkMuted,
  },
  priorityRow: { flexDirection: "row", gap: spacing.sm },
  chip: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  chipActive: {
    backgroundColor: colors.bg,
    borderColor: colors.bg,
  },
  chipLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.ink,
  },
  chipLabelActive: { color: colors.accent },
  error: {
    fontFamily: typography.bodyMedium,
    color: colors.danger,
  },
});
}
