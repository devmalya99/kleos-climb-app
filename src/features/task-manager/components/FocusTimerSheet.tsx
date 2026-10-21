import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { formatCountdown } from "@/shared/hooks/useCountdown";
import { Button } from "@/shared/components/Button";
import { ChipButton } from "@/shared/components/ChipButton";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { TIMER_PRESET_MINUTES } from "../constants/taskManager.constants";
import { useFocusTimer } from "../hooks/useFocusTimer";
import type { Task } from "../types/taskManager.types";
import { timerMinutesSchema } from "../utils/taskManager.schemas";

type FocusTimerSheetProps = {
  task: Task;
  onMarkDone: () => void;
  onClose: () => void;
};

/** Mount only while open. Closing unmounts the sheet, which stops and resets the timer. */
export function FocusTimerSheet({ task, onMarkDone, onClose }: FocusTimerSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const timer = useFocusTimer();
  const [customText, setCustomText] = useState("");
  const [customError, setCustomError] = useState<string | undefined>();

  function applyCustom() {
    const parsed = timerMinutesSchema.safeParse(Number(customText));
    if (!customText.trim() || !parsed.success) {
      setCustomError(parsed.success ? "Enter minutes (1–180)" : parsed.error.issues[0]?.message);
      return;
    }
    setCustomError(undefined);
    timer.setDuration(parsed.data);
  }

  const finished = !timer.running && timer.remainingSeconds === 0;
  const started = timer.remainingSeconds !== timer.durationMinutes * 60;

  return (
    <SheetModal visible title="Focus timer" onClose={onClose}>
      <Text style={styles.task}>{task.title}</Text>
      <Text style={styles.clock} accessibilityLiveRegion="polite">
        {formatCountdown(timer.remainingSeconds)}
      </Text>
      {finished ? <Text style={styles.done}>Time is up. Nice work.</Text> : null}

      {timer.running ? (
        <Button label="Pause" variant="secondary" onPress={timer.pause} />
      ) : (
        <Button label={started && !finished ? "Resume" : "Start"} onPress={timer.start} />
      )}
      <Button label="Reset" variant="ghost" onPress={timer.reset} />

      {timer.running ? null : (
        <View style={styles.setup}>
          <View style={styles.presets}>
            {TIMER_PRESET_MINUTES.map((minutes) => (
              <ChipButton
                key={minutes}
                label={`${minutes} min`}
                active={timer.durationMinutes === minutes}
                onPress={() => timer.setDuration(minutes)}
              />
            ))}
          </View>
          <TextField
            label="Custom minutes (1–180)"
            value={customText}
            onChangeText={setCustomText}
            keyboardType="numeric"
            error={customError}
          />
          <Button label="Set custom time" variant="ghost" onPress={applyCustom} />
        </View>
      )}

      <Button
        label="Mark task done"
        variant="secondary"
        onPress={() => {
          onMarkDone();
          onClose();
        }}
      />
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  task: { fontFamily: typography.bodyBold, fontSize: 17, color: colors.ink },
  clock: {
    fontFamily: typography.display,
    fontSize: 88,
    letterSpacing: 2,
    color: colors.ink,
    textAlign: "center",
  },
  done: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: colors.success,
    textAlign: "center",
  },
  setup: { gap: spacing.sm },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
}
