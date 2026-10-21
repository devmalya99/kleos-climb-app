import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";

import {
  COLOSSEUM_DAILY_ATTEMPTS,
  COLOSSEUM_ELIXIR_RECOVERY_STREAK,
  COLOSSEUM_MAX_ELIXIRS,
  COLOSSEUM_STARTING_ELIXIRS,
  COLOSSEUM_XP_PER_CORRECT,
} from "../constants/colosseum.constants";
import type { ColosseumStatus } from "../types/colosseum.types";

type ColosseumRulesProps = {
  status: ColosseumStatus;
  starting: boolean;
  error: string | null;
  onStart: () => void;
  onBack: () => void;
};

export function ColosseumRules({ status, starting, error, onStart, onBack }: ColosseumRulesProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.rule}>• Start with {COLOSSEUM_STARTING_ELIXIRS} elixirs (max {COLOSSEUM_MAX_ELIXIRS}).</Text>
        <Text style={styles.rule}>• A wrong or timed-out strike costs an elixir; at 0 the run ends.</Text>
        <Text style={styles.rule}>• Every {COLOSSEUM_ELIXIR_RECOVERY_STREAK} correct in a row restores 1 elixir.</Text>
        <Text style={styles.rule}>• {COLOSSEUM_XP_PER_CORRECT} skill XP for each correct strike.</Text>
        <Text style={styles.rule}>• {COLOSSEUM_DAILY_ATTEMPTS} counted runs per realm per day. Surrendering counts.</Text>
      </View>

      <Text style={styles.record}>
        Personal best: {status.personalBest.bestScore} correct · best streak {status.personalBest.bestStreak}
      </Text>
      <Text style={styles.record}>
        Runs today: {status.attemptsUsedToday} · remaining: {status.attemptsRemaining}
      </Text>

      {!status.canStart ? (
        <Text style={styles.error}>Daily limit reached for this realm. Come back tomorrow.</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label={starting ? "Forging the arena…" : "Enter the Colosseum"}
        onPress={onStart}
        loading={starting}
        disabled={!status.canStart}
      />
      <Button label="Back" variant="ghost" onPress={onBack} />
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.md },
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
  },
  rule: { fontFamily: typography.body, fontSize: 15, lineHeight: 22, color: colors.ink },
  record: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.danger },
});
}
