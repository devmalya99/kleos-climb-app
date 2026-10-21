import { StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { SheetModal } from "@/shared/components/SheetModal";

import { useProgressReport } from "../hooks/useProgressReport";

import { ProgressReportView } from "./ProgressReportView";

type ProgressReportSheetProps = {
  examId: string;
  categoryId: string;
  title?: string;
  /** Mount only while open. */
  onClose: () => void;
};

/** Cached progress report for a realm, with generate / regenerate actions. */
export function ProgressReportSheet({
  examId,
  categoryId,
  title = "Progress report",
  onClose,
}: ProgressReportSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const report = useProgressReport(examId, categoryId);

  return (
    <SheetModal visible title={title} onClose={onClose}>
      {report.isLoading ? <LoadingBlock label="Loading report…" /> : null}

      {report.loadError ? (
        <>
          <Text style={styles.error}>{getErrorMessage(report.loadError)}</Text>
          <Button label="Try again" variant="secondary" onPress={report.reload} />
        </>
      ) : null}

      {report.report ? <ProgressReportView report={report.report} /> : null}

      {!report.isLoading && !report.loadError && !report.report ? (
        <Text style={styles.muted}>No report has been compiled for this realm yet.</Text>
      ) : null}

      {report.actionError ? <Text style={styles.error}>{report.actionError}</Text> : null}

      {!report.isLoading && !report.loadError ? (
        <Button
          label={report.report ? "Regenerate report" : "Generate report"}
          variant={report.report ? "ghost" : "primary"}
          loading={report.isWorking}
          onPress={() => void (report.report ? report.regenerate() : report.generate())}
        />
      ) : null}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
  muted: { fontFamily: typography.body, fontSize: 15, color: colors.inkMuted },
});
}
