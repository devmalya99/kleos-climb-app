import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { SheetModal } from "@/shared/components/SheetModal";

import { useReviewTasks } from "../hooks/useReviewTasks";
import type { Task } from "../types/taskManager.types";

type ReviewTasksSheetProps = {
  categoryId: string;
  tasks: Task[];
  onClose: () => void;
};

/** Mount only while open. Fetches the review once, previews splits, apply saves. */
export function ReviewTasksSheet({ categoryId, tasks, onClose }: ReviewTasksSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const review = useReviewTasks(categoryId);
  const { startReview } = review;

  useEffect(() => {
    void startReview();
    // Intentionally runs once per mount: one review per open, never on re-render.
  }, []);

  const titleById = new Map(tasks.map((task) => [task.id, task.title]));

  async function handleApply() {
    if (await review.apply()) onClose();
  }

  return (
    <SheetModal visible title="Review tasks" onClose={onClose}>
      {review.isReviewing || (review.items === null && !review.error) ? (
        <LoadingBlock label="Reviewing your tasks…" />
      ) : null}

      {review.error ? <Text style={styles.error}>{review.error}</Text> : null}

      {review.items && review.splittable.length === 0 ? (
        <Text style={styles.hint}>All tasks look clear. Nothing to split.</Text>
      ) : null}

      {review.splittable.map((item) => {
        const checked = review.selected.has(item.taskId);
        return (
          <Pressable
            key={item.taskId}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            onPress={() => review.toggle(item.taskId)}
            style={[styles.card, checked ? styles.cardActive : null]}
          >
            <Text style={styles.title}>{titleById.get(item.taskId) ?? "Task"}</Text>
            <Text style={styles.reason}>{item.reason}</Text>
            <View style={styles.splits}>
              {item.suggestedTitles?.map((title) => (
                <Text key={title} style={styles.split}>
                  • {title}
                </Text>
              ))}
            </View>
          </Pressable>
        );
      })}

      {review.splittable.length > 0 ? (
        <Button
          label={`Apply ${review.selected.size} split${review.selected.size === 1 ? "" : "s"}`}
          onPress={() => void handleApply()}
          loading={review.isApplying}
          disabled={review.selected.size === 0}
        />
      ) : null}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  hint: { fontFamily: typography.body, fontSize: 15, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  cardActive: { borderColor: colors.bg, borderWidth: 2 },
  title: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  reason: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
  splits: { gap: 2, marginTop: spacing.xs },
  split: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.ink },
});
}
