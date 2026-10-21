import { StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { ResultOverlay } from "@/shared/components/ResultOverlay";

import { COLOSSEUM_END_REASON_LABEL } from "../constants/colosseum.constants";
import type { ColosseumEnded } from "../types/colosseum.types";

type ColosseumResultProps = {
  visible: boolean;
  result: ColosseumEnded | null;
  canRunAgain: boolean;
  onRunAgain: () => void;
  onClose: () => void;
};

export function ColosseumResult({ visible, result, canRunAgain, onRunAgain, onClose }: ColosseumResultProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (!result) return null;

  const { recordBreaks, lastSkillAward, reason, answerFeedback } = result;
  const brokeRecord = recordBreaks.bestScoreBroken || recordBreaks.bestStreakBroken;

  return (
    <ResultOverlay
      visible={visible}
      tone={brokeRecord ? "success" : "neutral"}
      title={brokeRecord ? "New record!" : "Run over"}
      subtitle={reason ? COLOSSEUM_END_REASON_LABEL[reason] : undefined}
      onRequestClose={onClose}
      actions={
        <>
          {canRunAgain ? <Button label="Run again" onPress={onRunAgain} /> : null}
          <Button label="Back to realm" variant="ghost" onPress={onClose} />
        </>
      }
    >
      <Text style={styles.stat}>
        {result.totalCorrect} correct · {result.totalWrong} wrong · best streak {result.maxStreak}
      </Text>
      <Text style={styles.stat}>{result.xpEarned} skill XP earned</Text>
      {recordBreaks.bestScoreBroken ? (
        <Text style={styles.record}>
          Best score: {result.personalBest.bestScore} (was {recordBreaks.previousBest.bestScore})
        </Text>
      ) : null}
      {recordBreaks.bestStreakBroken ? (
        <Text style={styles.record}>
          Best streak: {result.personalBest.bestStreak} (was {recordBreaks.previousBest.bestStreak})
        </Text>
      ) : null}
      {lastSkillAward?.rankUp ? (
        <Text style={styles.record}>
          {lastSkillAward.skillName} ranked up to {lastSkillAward.newRank}!
        </Text>
      ) : null}
      {answerFeedback ? (
        <Text style={styles.stat}>Correct answer: {answerFeedback.correctOption}</Text>
      ) : null}
    </ResultOverlay>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  stat: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.inkMuted },
  record: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.success },
});
}
