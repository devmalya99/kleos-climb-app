import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import type { ClutterNote } from "../types/brainClutter.types";

type NoteRowProps = {
  note: ClutterNote;
  onPress: () => void;
  onToggleCompleted: () => void;
};

export function NoteRow({ note, onPress, onToggleCompleted }: NoteRowProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      {note.isTask ? (
        <PressableScale
          accessibilityRole="checkbox"
          accessibilityLabel={`Mark ${note.title} ${note.isCompleted ? "open" : "done"}`}
          accessibilityState={{ checked: note.isCompleted }}
          hitSlop={8}
          pressedScale={0.9}
          onPress={onToggleCompleted}
          style={[styles.box, note.isCompleted ? styles.boxDone : null]}
        >
          {note.isCompleted ? <Text style={styles.tick}>✓</Text> : null}
        </PressableScale>
      ) : null}
      <PressableScale onPress={onPress} containerStyle={styles.copy} style={styles.copy}>
        <Text style={[styles.title, note.isCompleted ? styles.titleDone : null]}>
          {note.title}
        </Text>
        {note.content ? (
          <Text style={styles.preview} numberOfLines={2}>
            {note.content}
          </Text>
        ) : null}
      </PressableScale>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  box: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  boxDone: { backgroundColor: colors.success, borderColor: colors.success },
  tick: { color: colors.onFill, fontFamily: typography.bodyBold, fontSize: 15 },
  copy: { flex: 1, gap: 4 },
  title: { fontFamily: typography.bodyBold, fontSize: 16, color: colors.ink },
  titleDone: { textDecorationLine: "line-through", color: colors.inkSubtle },
  preview: { fontFamily: typography.body, fontSize: 14, color: colors.inkMuted },
});
}
