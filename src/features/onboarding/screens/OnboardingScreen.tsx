import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { useAuth } from "@/features/auth";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { TextField } from "@/shared/components/TextField";

import { completeOnboardingApi } from "../api/completeOnboarding";
import {
  displayNameSchema,
  onboardingGoalSchema,
  onboardingDeadlineSchema,
  onboardingRequestSchema,
  onboardingTaskTitleSchema,
} from "../model/schemas";
import { useOnboardingDraftStore } from "../store/onboardingDraft.store";
import { defaultDeadline } from "../utils/defaultDeadline";

const STEP_INDEX = { name: 1, expedition: 2, task: 3 } as const;

export function OnboardingScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { refreshMe } = useAuth();
  const draft = useOnboardingDraftStore();
  const setDraft = useOnboardingDraftStore((state) => state.setDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!useOnboardingDraftStore.getState().deadline) {
      setDraft({ deadline: defaultDeadline() });
    }
  }, [setDraft]);

  function fail(message: string) {
    setError(message);
  }

  function advance() {
    setError(null);
    if (draft.step === "name") {
      const parsed = displayNameSchema.safeParse(draft.displayName);
      if (!parsed.success) {
        fail(parsed.error.issues[0]?.message ?? "Enter your name");
        return;
      }
      draft.setDraft({ displayName: parsed.data, step: "expedition" });
      return;
    }
    if (draft.step === "expedition") {
      const goal = onboardingGoalSchema.safeParse(draft.goal);
      if (!goal.success) {
        fail(goal.error.issues[0]?.message ?? "Describe the expedition");
        return;
      }
      const deadline = onboardingDeadlineSchema.safeParse(draft.deadline);
      if (!deadline.success) {
        fail(deadline.error.issues[0]?.message ?? "Pick a valid date");
        return;
      }
      draft.setDraft({ goal: goal.data, deadline: deadline.data, step: "task" });
      return;
    }
    void save();
  }

  async function save() {
    const parsed = onboardingRequestSchema.safeParse({
      displayName: draft.displayName,
      goal: draft.goal,
      deadline: draft.deadline,
      taskTitle: draft.taskTitle,
    });
    if (!parsed.success) {
      fail(parsed.error.issues[0]?.message ?? "Check the task and try again");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await completeOnboardingApi(parsed.data);
      const me = await refreshMe();
      if (me.onboardedAt) {
        draft.clear();
        router.replace("/(tabs)");
        return;
      }
      fail("Saved, but the account still looks unfinished. Try again.");
    } catch (err) {
      logger.warn("Onboarding save failed", { message: getErrorMessage(err) });
      fail(getErrorMessage(err, "Could not save your expedition"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={styles.kicker}>Step {STEP_INDEX[draft.step]} of 3</Text>
      {draft.step === "name" ? (
        <View style={styles.form}>
          <Text style={styles.title}>What should we call you?</Text>
          <TextField
            label="Name"
            value={draft.displayName}
            onChangeText={(displayName) => draft.setDraft({ displayName })}
            autoCapitalize="words"
          />
        </View>
      ) : null}
      {draft.step === "expedition" ? (
        <View style={styles.form}>
          <Text style={styles.title}>Name the expedition</Text>
          <Text style={styles.copy}>One goal and a deadline. You can add more tasks later.</Text>
          <TextField
            label="Goal"
            value={draft.goal}
            onChangeText={(goal) => draft.setDraft({ goal })}
            placeholder="Finish DSA"
            autoCapitalize="sentences"
          />
          <TextField
            label="Deadline"
            value={draft.deadline}
            onChangeText={(deadline) => draft.setDraft({ deadline })}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
          />
        </View>
      ) : null}
      {draft.step === "task" ? (
        <View style={styles.form}>
          <Text style={styles.title}>The first task</Text>
          <Text style={styles.copy}>
            The single most important task on this expedition. The description stays empty.
          </Text>
          <TextField
            label="Task"
            value={draft.taskTitle}
            onChangeText={(taskTitle) => draft.setDraft({ taskTitle })}
            placeholder="Learn arrays"
            autoCapitalize="sentences"
          />
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {draft.step !== "name" ? (
          <Button
            label="Back"
            variant="ghost"
            onPress={() => {
              setError(null);
              draft.setDraft({ step: draft.step === "task" ? "expedition" : "name" });
            }}
          />
        ) : null}
        <Button
          label={draft.step === "task" ? "Save" : "Continue"}
          onPress={advance}
          loading={saving}
        />
      </View>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    content: { gap: spacing.md, paddingTop: spacing.xl },
    kicker: {
      fontFamily: typography.bodyMedium,
      fontSize: 13,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: colors.inkMuted,
    },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 32,
      letterSpacing: -0.6,
      color: colors.ink,
    },
    copy: { fontFamily: typography.body, fontSize: 16, lineHeight: 22, color: colors.inkMuted },
    form: { gap: spacing.md },
    actions: { gap: spacing.sm, marginTop: spacing.md },
    error: { fontFamily: typography.bodyMedium, color: colors.danger },
  });
}
