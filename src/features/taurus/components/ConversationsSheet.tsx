import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { ChipButton } from "@/shared/components/ChipButton";
import { PressableScale } from "@/shared/components/PressableScale";
import { SheetModal } from "@/shared/components/SheetModal";

import { TAURUS_MAX_CONVERSATIONS } from "../constants/taurus.constants";
import type { TaurusConversationSummary } from "../types/taurus.types";

type ConversationsSheetProps = {
  conversations: TaurusConversationSummary[];
  activeId: string | null;
  busy: boolean;
  onSelect: (conversationId: string) => void;
  onDelete: (conversation: TaurusConversationSummary) => void;
  onNewChat: () => void;
  onClose: () => void;
};

export function ConversationsSheet({
  conversations,
  activeId,
  busy,
  onSelect,
  onDelete,
  onNewChat,
  onClose,
}: ConversationsSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SheetModal visible title="Chats" onClose={onClose}>
      <Button label="New chat" onPress={onNewChat} loading={busy} />
      <Text style={styles.hint}>
        Taurus keeps your latest {TAURUS_MAX_CONVERSATIONS} chats; older ones are removed automatically.
      </Text>
      {conversations.map((conversation) => (
        <View
          key={conversation.id}
          style={[styles.row, conversation.id === activeId ? styles.rowActive : null]}
        >
          <PressableScale
            containerStyle={styles.copy}
            style={styles.copy}
            onPress={() => {
              onSelect(conversation.id);
              onClose();
            }}
          >
            <Text style={styles.title} numberOfLines={1}>
              {conversation.title}
            </Text>
            {conversation.preview ? (
              <Text style={styles.preview} numberOfLines={2}>
                {conversation.preview}
              </Text>
            ) : null}
          </PressableScale>
          <ChipButton label="Delete" danger disabled={busy} onPress={() => onDelete(conversation)} />
        </View>
      ))}
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  hint: { fontFamily: typography.body, fontSize: 13, color: colors.inkSubtle },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  rowActive: { borderColor: colors.bg, borderWidth: 2 },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  preview: { fontFamily: typography.body, fontSize: 13, color: colors.inkMuted },
});
}
