import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { MAX_EXPAND_TASKS } from "../constants/taskManager.constants";
import { useExpandTasks } from "../hooks/useExpandTasks";

type ExpandTasksSheetProps = {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
};

/** Mount only while open. Step 1 pastes text, step 2 previews, accept saves. */
export function ExpandTasksSheet({ categoryId, categoryName, onClose }: ExpandTasksSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const expand = useExpandTasks(categoryId);

  async function handleAccept() {
    if (await expand.accept()) onClose();
  }

  return (
    <SheetModal visible title="Expand into tasks" onClose={onClose}>
      {expand.proposals === null ? (
        <>
          <Text style={styles.hint}>
            Paste notes or a goal. The AI proposes up to {MAX_EXPAND_TASKS} tasks for
            “{categoryName}”. Nothing is saved until you accept.
          </Text>
          <TextField
            label="Content"
            value={expand.content}
            onChangeText={expand.setContent}
            autoCapitalize="sentences"
            multiline
          />
          {expand.error ? <Text style={styles.error}>{expand.error}</Text> : null}
          <Button label="Preview tasks" onPress={() => void expand.preview()} loading={expand.isPreviewing} />
        </>
      ) : (
        <>
          <Text style={styles.hint}>
            {expand.proposals.length} proposed. Remove any you do not want, then accept.
          </Text>
          {expand.proposals.map((proposal, index) => (
            <View key={`${proposal.title}-${index}`} style={styles.card}>
              <View style={styles.copy}>
                <Text style={styles.title}>{proposal.title}</Text>
                {proposal.notes ? <Text style={styles.notes}>{proposal.notes}</Text> : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${proposal.title}`}
                hitSlop={8}
                onPress={() => expand.removeProposal(index)}
              >
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          ))}
          {expand.error ? <Text style={styles.error}>{expand.error}</Text> : null}
          <Button
            label={`Accept ${expand.proposals.length} tasks`}
            onPress={() => void handleAccept()}
            loading={expand.isAccepting}
            disabled={expand.proposals.length === 0}
          />
          <Button label="Back" variant="ghost" onPress={expand.backToEdit} />
        </>
      )}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  hint: { fontFamily: typography.body, fontSize: 14, color: colors.inkMuted, lineHeight: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  copy: { flex: 1, gap: 4 },
  title: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  notes: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
  remove: { fontFamily: typography.bodyMedium, fontSize: 14, color: colors.danger },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
