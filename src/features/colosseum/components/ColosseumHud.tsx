import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { formatCountdown } from "@/shared/hooks/useCountdown";

import {
  COLOSSEUM_ELIXIR_RECOVERY_STREAK,
  COLOSSEUM_MAX_ELIXIRS,
} from "../constants/colosseum.constants";
import type { ColosseumSession } from "../types/colosseum.types";

type ColosseumHudProps = {
  session: ColosseumSession;
  /** Seconds left on the current strike; null when untimed. */
  remaining: number | null;
  onSurrender: () => void;
  surrenderDisabled: boolean;
};

/** Reads everything from the server's session snapshot. */
export function ColosseumHud({ session, remaining, onSurrender, surrenderDisabled }: ColosseumHudProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const toNextElixir = COLOSSEUM_ELIXIR_RECOVERY_STREAK - (session.streak % COLOSSEUM_ELIXIR_RECOVERY_STREAK);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Stat styles={styles} label="Elixirs" value={`${session.elixirs}/${COLOSSEUM_MAX_ELIXIRS}`} danger={session.elixirs <= 1} />
        <Stat styles={styles} label="Streak" value={String(session.streak)} />
        <Stat styles={styles} label="XP" value={String(session.xpEarned)} />
        {remaining !== null ? (
          <Stat styles={styles} label="Time" value={formatCountdown(remaining)} danger={remaining <= 5} />
        ) : null}
      </View>
      <View style={styles.row}>
        <Text style={styles.note}>
          {session.totalCorrect} correct · {session.totalWrong} wrong · {toNextElixir} to next elixir
        </Text>
        <Text
          accessibilityRole="button"
          accessibilityState={{ disabled: surrenderDisabled }}
          style={[styles.surrender, surrenderDisabled ? styles.disabled : null]}
          onPress={surrenderDisabled ? undefined : onSurrender}
        >
          Surrender
        </Text>
      </View>
    </View>
  );
}

function Stat({
  styles,
  label,
  value,
  danger,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.value, danger ? styles.danger : null]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.bgElevated },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  stat: { alignItems: "center", flex: 1 },
  value: { fontFamily: typography.display, fontSize: 28, color: colors.accent },
  danger: { color: colors.danger },
  label: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.inkMuted },
  note: { flex: 1, fontFamily: typography.body, fontSize: 12, color: colors.inkMuted },
  surrender: { fontFamily: typography.bodyBold, fontSize: 13, color: colors.danger },
  disabled: { opacity: 0.4 },
});
}
