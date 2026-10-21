import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { TextField } from "@/shared/components/TextField";

import {
  DEFAULT_DEADLINE_DAYS,
  KEY_STEP_COUNT,
  STEP_PLACEHOLDERS,
} from "../constants/climb.constants";
import { climbSetupSchema, type ClimbSetupInput } from "../utils/climb.schemas";
import { DeadlineField } from "./DeadlineField";

type GoalSetupWizardProps = {
  onStart: (input: ClimbSetupInput) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
};

function defaultDeadline(): string {
  const date = new Date();
  date.setDate(date.getDate() + DEFAULT_DEADLINE_DAYS);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function GoalSetupWizard({ onStart, onCancel, isSubmitting }: GoalSetupWizardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [step, setStep] = useState<"summit" | "steps">("summit");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [keySteps, setKeySteps] = useState(() =>
    Array.from({ length: KEY_STEP_COUNT }, () => ({ title: "", description: "" })),
  );
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const parsed = climbSetupSchema.safeParse({ goal, deadline, keySteps });
    if (step === "summit") {
      const summitIssue = parsed.error?.issues.find((issue) => issue.path[0] !== "keySteps");
      if (summitIssue) {
        setError(summitIssue.message);
        return;
      }
      setError(null);
      setStep("steps");
      return;
    }
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the tasks and try again");
      return;
    }
    onStart(parsed.data);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Step {step === "summit" ? "1" : "2"} of 2</Text>
      <Text style={styles.title}>
        {step === "summit" ? "Name your summit" : "Plan your first three camps"}
      </Text>
      {step === "summit" ? (
        <>
          <TextField
            label="What is your goal?"
            value={goal}
            onChangeText={setGoal}
            placeholder="Crack a high-paying job interview"
            autoCapitalize="sentences"
          />
          <DeadlineField value={deadline} onChange={setDeadline} />
        </>
      ) : (
        <>
          <Text style={styles.copy}>
            Write the three tasks that will get you to {goal.trim()}. A note on each one is optional.
          </Text>
          {keySteps.map((value, index) => (
            <View key={index} style={styles.task}>
              <TextField
                label={`Task ${index + 1}`}
                value={value.title}
                onChangeText={(title) =>
                  setKeySteps((steps) =>
                    steps.map((stepValue, stepIndex) =>
                      stepIndex === index ? { ...stepValue, title } : stepValue,
                    ),
                  )
                }
                placeholder={STEP_PLACEHOLDERS[index]}
                autoCapitalize="sentences"
              />
              <TextField
                label="Note (optional)"
                value={value.description}
                onChangeText={(description) =>
                  setKeySteps((steps) =>
                    steps.map((stepValue, stepIndex) =>
                      stepIndex === index ? { ...stepValue, description } : stepValue,
                    ),
                  )
                }
                placeholder="Optional note"
                autoCapitalize="sentences"
              />
            </View>
          ))}
        </>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {step === "steps" ? (
          <Button label="Back" variant="ghost" onPress={() => setStep("summit")} style={styles.action} />
        ) : onCancel ? (
          <Button label="Cancel" variant="ghost" onPress={onCancel} style={styles.action} />
        ) : (
          <View style={styles.action} />
        )}
        <Button
          label={step === "summit" ? "Next" : "Start climbing"}
          onPress={submit}
          loading={isSubmitting}
          style={styles.action}
        />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: { gap: spacing.md },
    kicker: {
      fontFamily: typography.bodyMedium,
      fontSize: 13,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: colors.inkMuted,
    },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 28,
      letterSpacing: -0.4,
      color: colors.ink,
    },
    copy: {
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 22,
      color: colors.inkMuted,
    },
    task: {
      gap: spacing.sm,
      paddingTop: spacing.sm,
    },
    error: {
      fontFamily: typography.bodyMedium,
      color: colors.danger,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    action: { flex: 1 },
  });
}
