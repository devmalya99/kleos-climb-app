import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";

import type { RewriteResult } from "../types/brainClutter.types";

type RewritePreviewPanelProps = {
  preview: RewriteResult;
  onApply: () => void;
  onDiscard: () => void;
};

/** Shows the AI proposal. Applying only fills the editor; saving is a separate step. */
export function RewritePreviewPanel({ preview, onApply, onDiscard }: RewritePreviewPanelProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.panel}>
      <Text style={styles.label}>AI rewrite preview</Text>
      <Text style={styles.title}>{preview.title}</Text>
      {preview.content ? <Text style={styles.body}>{preview.content}</Text> : null}
      <View style={styles.actions}>
        <Button label="Apply to note" onPress={onApply} style={styles.action} />
        <Button label="Discard" variant="ghost" onPress={onDiscard} style={styles.action} />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  panel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceCard,
  },
  label: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.inkSubtle },
  title: { fontFamily: typography.bodyBold, fontSize: 17, color: colors.ink },
  body: { fontFamily: typography.body, fontSize: 15, color: colors.inkMuted, lineHeight: 22 },
  actions: { gap: spacing.sm, marginTop: spacing.xs },
  action: { minHeight: 44 },
});
}
