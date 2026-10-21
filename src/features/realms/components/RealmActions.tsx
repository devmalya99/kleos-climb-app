import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";

import type { getAnalyseAvailability } from "../utils/analyseAvailability";

type RealmActionsProps = {
  analyse: ReturnType<typeof getAnalyseAvailability>;
  onAnalyse: () => void;
  onColosseum: () => void;
  onAutofill: () => void;
};

export function RealmActions({
  analyse,
  onAnalyse,
  onColosseum,
  onAutofill,
}: RealmActionsProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      <Button label={analyse.label} onPress={onAnalyse} disabled={!analyse.enabled} />
      {analyse.hint ? <Text style={styles.hint}>{analyse.hint}</Text> : null}
      <View style={styles.row}>
        <Button label="Colosseum" variant="secondary" onPress={onColosseum} style={styles.half} />
        <Button label="Autofill" variant="ghost" onPress={onAutofill} style={styles.half} />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: "row", gap: spacing.sm },
  half: { flex: 1 },
  hint: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSubtle,
  },
});
}
