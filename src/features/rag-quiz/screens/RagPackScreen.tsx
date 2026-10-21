import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import { PACK_STATUS } from "../constants/ragQuiz.constants";
import { usePackProcessing } from "../hooks/usePackProcessing";
import { useStartQuiz } from "../hooks/useStartQuiz";
import { getPackProgress } from "../utils/ragQuiz.utils";

type RagPackScreenProps = {
  packId: string;
};

/** Shows pack preparation progress, then lets the user start the quiz. */
export function RagPackScreen({ packId }: RagPackScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const processing = usePackProcessing(packId);
  const quiz = useStartQuiz();
  const { pack } = processing;

  if (processing.isLoading && !pack) {
    return (
      <Screen>
        <LoadingBlock label="Loading pack…" />
      </Screen>
    );
  }

  if (!pack) {
    return (
      <Screen>
        <ScreenHeader title="Pack" />
        <EmptyState
          title="Pack unavailable"
          body={getErrorMessage(processing.loadError ?? processing.error, "This pack could not be loaded.")}
          actionLabel="Try again"
          onAction={processing.retry}
        />
      </Screen>
    );
  }

  const progress = getPackProgress(pack);
  const ready = pack.status === PACK_STATUS.READY;
  const failed = pack.status === PACK_STATUS.FAILED;
  const stalled = Boolean(processing.error) && !failed;

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader
        title={ready ? "Ready to quiz" : failed ? "Preparation failed" : "Preparing your PDFs"}
        subtitle={pack.documents.map((doc) => doc.fileName).join(", ")}
      />

      <View style={styles.card}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress.percent}%` }]} />
        </View>
        <Text style={styles.status} accessibilityLiveRegion="polite">
          {pack.statusMessage || "Working…"}
        </Text>
        {progress.chunks > 0 ? (
          <Text style={styles.meta}>
            {progress.embedded} of {progress.chunks} chunks embedded
          </Text>
        ) : null}
      </View>

      {failed ? (
        <Text style={styles.error}>{pack.error ?? "Processing failed."}</Text>
      ) : null}
      {stalled ? <Text style={styles.error}>{processing.error}</Text> : null}
      {quiz.error ? <Text style={styles.error}>{quiz.error}</Text> : null}

      {ready ? (
        <Button
          label="Start quiz"
          onPress={() => void quiz.startQuiz(packId)}
          loading={quiz.startingPackId === packId}
        />
      ) : null}
      {stalled ? <Button label="Retry" onPress={processing.retry} loading={processing.isProcessing} /> : null}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  track: {
    height: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: 8, backgroundColor: colors.success },
  status: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.ink },
  meta: { fontFamily: typography.body, fontSize: 13, color: colors.inkSubtle },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
