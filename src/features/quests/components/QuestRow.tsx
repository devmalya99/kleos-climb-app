import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import type { PublicTopic } from "@/shared/types/study.types";

import { QUEST_PRIORITY_LABEL } from "../constants/quests.constants";

import { QuestActionLink } from "./QuestActionLink";

type QuestRowProps = {
  quest: PublicTopic;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClaim: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function QuestRow({
  quest,
  canMoveUp,
  canMoveDown,
  onClaim,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestRowProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.card, quest.isCompleted ? styles.done : null]}>
      <View style={styles.head}>
        <Text style={styles.name}>{quest.name}</Text>
        <Text style={styles.xp}>{quest.xpValue} XP</Text>
      </View>
      {quest.description ? <Text style={styles.desc}>{quest.description}</Text> : null}
      <Text style={styles.meta}>
        {QUEST_PRIORITY_LABEL[quest.priority]} priority
        {quest.isCompleted ? " · Mastered" : ""}
      </Text>
      {quest.isCompleted ? null : <Button label="Claim XP" onPress={onClaim} />}
      <View style={styles.actions}>
        <QuestActionLink label="Edit" onPress={onEdit} />
        <QuestActionLink label="Delete" tone="danger" onPress={onDelete} />
        <View style={styles.spacer} />
        <QuestActionLink label="↑" onPress={onMoveUp} disabled={!canMoveUp} />
        <QuestActionLink label="↓" onPress={onMoveDown} disabled={!canMoveDown} />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  done: { opacity: 0.7 },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  name: {
    flex: 1,
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  xp: {
    fontFamily: typography.bodyBold,
    fontSize: 13,
    color: colors.ink,
  },
  desc: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  meta: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.inkSubtle,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  spacer: { flex: 1 },
});
}
