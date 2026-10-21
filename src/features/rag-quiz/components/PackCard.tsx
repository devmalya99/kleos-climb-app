import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";

import type { RagPackSummary } from "../types/ragQuiz.types";
import { formatBytes } from "../utils/ragQuiz.utils";

type PackCardProps = {
  pack: RagPackSummary;
  starting: boolean;
  deleting: boolean;
  onStart: () => void;
  onDelete: () => void;
};

export function PackCard({ pack, starting, deleting, onStart, onDelete }: PackCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const accuracy =
    pack.lastAccuracyPercent === null ? "No quiz yet" : `Last accuracy ${pack.lastAccuracyPercent}%`;

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {pack.fileNames.join(", ")}
      </Text>
      <Text style={styles.meta}>
        {formatBytes(pack.totalBytes)} · {pack.totalChunks} chunks · {pack.sessionCount}{" "}
        {pack.sessionCount === 1 ? "quiz" : "quizzes"} · {accuracy}
      </Text>
      <View style={styles.actions}>
        <Button
          label="Quiz me"
          onPress={onStart}
          loading={starting}
          disabled={deleting}
          style={styles.action}
        />
        <Button
          label="Delete"
          variant="ghost"
          onPress={onDelete}
          loading={deleting}
          disabled={starting}
          style={styles.action}
        />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  title: { fontFamily: typography.bodyBold, fontSize: 16, color: colors.ink },
  meta: { fontFamily: typography.body, fontSize: 13, color: colors.inkSubtle, lineHeight: 18 },
  actions: { flexDirection: "row", gap: spacing.sm },
  action: { flex: 1, minHeight: 44 },
});
}
