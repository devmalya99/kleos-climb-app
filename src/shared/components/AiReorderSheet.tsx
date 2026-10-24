import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { SheetModal } from "@/shared/components/SheetModal";

type ReorderRow = {
  id: string;
  title: string;
};

type AiReorderSheetProps = {
  loading: boolean;
  applying: boolean;
  error: string | null;
  reason: string | null;
  tasks: ReorderRow[];
  onApply: () => void;
  onRetry: () => void;
  onClose: () => void;
};

/** Suggestion dialog shared by a summit and a task category. Closing does not save. */
export function AiReorderSheet({
  loading,
  applying,
  error,
  reason,
  tasks,
  onApply,
  onRetry,
  onClose,
}: AiReorderSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SheetModal visible title="AI reorder" onClose={onClose}>
      {loading ? <LoadingBlock label="Suggesting an order…" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && reason ? <Text style={styles.reason}>{reason}</Text> : null}
      {!loading && tasks.length > 0 ? (
        <View style={styles.list}>
          {tasks.map((task, index) => (
            <Text key={task.id} style={styles.row}>
              {index + 1}. {task.title}
            </Text>
          ))}
        </View>
      ) : null}
      {!loading && tasks.length > 0 ? (
        <Button label="Apply" onPress={onApply} loading={applying} />
      ) : null}
      {error ? <Button label="Try again" variant="secondary" onPress={onRetry} disabled={loading} /> : null}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    error: { fontFamily: typography.bodyMedium, color: colors.danger },
    reason: { fontFamily: typography.body, fontSize: 16, lineHeight: 22, color: colors.ink },
    list: { gap: spacing.sm },
    row: { fontFamily: typography.bodyMedium, fontSize: 16, color: colors.ink },
  });
}
