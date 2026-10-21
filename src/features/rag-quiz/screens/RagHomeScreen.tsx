import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import { PackCard } from "../components/PackCard";
import { PdfPickList } from "../components/PdfPickList";
import {
  RAG_MAX_DOCS,
  RAG_MAX_FILE_BYTES,
  RAG_MAX_PAGES,
} from "../constants/ragQuiz.constants";
import { usePdfUpload } from "../hooks/usePdfUpload";
import { useRagPacks } from "../hooks/useRagPacks";
import { useStartQuiz } from "../hooks/useStartQuiz";
import { formatBytes } from "../utils/ragQuiz.utils";

/** More → RAG Quiz: upload PDFs or reuse a ready pack from history. */
export function RagHomeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const upload = usePdfUpload();
  const packs = useRagPacks();
  const quiz = useStartQuiz();

  const inlineError = upload.error ?? quiz.error ?? packs.error;

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader
        title="RAG Quiz"
        subtitle={`Upload up to ${RAG_MAX_DOCS} text PDFs (${formatBytes(RAG_MAX_FILE_BYTES)} and ${RAG_MAX_PAGES} pages each) and quiz yourself on them.`}
      />

      <PdfPickList files={upload.files} onRemove={upload.removeFile} />
      <Button
        label={upload.files.length === 0 ? "Choose PDFs" : "Add more PDFs"}
        variant="secondary"
        onPress={() => void upload.pickFiles()}
        disabled={upload.isUploading}
      />
      {upload.files.length > 0 ? (
        <Button
          label="Upload and prepare"
          onPress={() => void upload.upload()}
          loading={upload.isUploading}
        />
      ) : null}
      {inlineError ? <Text style={styles.error}>{inlineError}</Text> : null}

      <Text style={styles.section}>History</Text>
      {packs.isLoading ? <LoadingBlock label="Loading packs…" /> : null}
      {packs.loadError ? (
        <EmptyState
          title="History unavailable"
          body={getErrorMessage(packs.loadError, "Could not load your packs.")}
          actionLabel="Try again"
          onAction={() => void packs.refetch()}
        />
      ) : null}
      {!packs.isLoading && !packs.loadError && packs.packs.length === 0 ? (
        <EmptyState title="No packs yet" body="Prepared PDFs show up here so you can quiz again." />
      ) : null}
      <View style={styles.list}>
        {packs.packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            starting={quiz.startingPackId === pack.id}
            deleting={packs.deletingPackId === pack.id}
            onStart={() => void quiz.startQuiz(pack.id)}
            onDelete={() => packs.deletePack(pack)}
          />
        ))}
      </View>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  section: {
    fontFamily: typography.bodyBold,
    fontSize: 18,
    letterSpacing: -0.2,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  list: { gap: spacing.sm },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
