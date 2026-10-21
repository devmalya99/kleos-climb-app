import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { QuizArena } from "@/shared/components/QuizArena";
import { useCountdown } from "@/shared/hooks/useCountdown";
import { confirmAction } from "@/shared/utils/confirmAction";

import type { ColosseumContinued, ColosseumRun } from "../types/colosseum.types";

import { ColosseumHud } from "./ColosseumHud";

type ColosseumArenaProps = {
  run: ColosseumRun;
  /** Set after a wrong, non-final strike: reveals the correct option. */
  pendingWrong: ColosseumContinued | null;
  busy: boolean;
  error: string | null;
  onAnswer: (selectedIndex: number) => void;
  onTimeout: () => void;
  onContinue: () => void;
  onSurrender: () => void;
};

/** Mount with `key={question.id}` so the selection and timer reset per strike. */
export function ColosseumArena({
  run,
  pendingWrong,
  busy,
  error,
  onAnswer,
  onTimeout,
  onContinue,
  onSurrender,
}: ColosseumArenaProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [selected, setSelected] = useState<number | null>(null);
  const { timer, question } = run;

  const seconds =
    timer.enabled && timer.mode === "per-question"
      ? (timer.secondsByQuestionId[question.id] ?? null)
      : null;
  // The clock stops while an answer is in flight or the correct option is on screen.
  const remaining = useCountdown(
    busy || pendingWrong ? null : seconds,
    question.id,
    onTimeout,
  );

  return (
    <QuizArena
      header={
        <ColosseumHud
          session={pendingWrong?.session ?? run.session}
          remaining={pendingWrong ? null : remaining}
          surrenderDisabled={busy}
          onSurrender={() =>
            confirmAction(
              {
                title: "Surrender run?",
                message: "The run ends now and still counts toward today's limit.",
                confirmLabel: "Surrender",
              },
              onSurrender,
            )
          }
        />
      }
      prompt={question.prompt}
      options={question.options}
      selectedIndex={selected}
      disabled={busy || Boolean(pendingWrong)}
      revealedCorrectOption={pendingWrong?.answerFeedback?.correctOption ?? null}
      onSelect={(index) => {
        setSelected(index);
        onAnswer(index);
      }}
      footer={
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {pendingWrong ? (
            <>
              <Text style={styles.wrong}>Missed! Elixir lost. Study the correct answer, then strike again.</Text>
              <Button label="Next strike" onPress={onContinue} />
            </>
          ) : null}
        </>
      }
    />
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
  wrong: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.warning },
});
}
