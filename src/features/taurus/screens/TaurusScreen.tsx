import { memo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabBarClearance } from "@/app/navigation/tabBar";
import { spacing, typography, useTheme } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";

import { ChatPane } from "../components/ChatPane";
import { ConversationsSheet } from "../components/ConversationsSheet";
import { TaurusHeader } from "../components/TaurusHeader";
import { TaurusStatusRow } from "../components/TaurusStatusRow";
import { useTaurusConversations } from "../hooks/useTaurusConversations";
import { useTaurusTrail } from "../hooks/useTaurusTrail";
import { taurusChrome } from "../utils/taurusChrome";

const backdrop = {
  light: require("../assets/light.jpg") as number,
  dark: require("../assets/dark.jpg") as number,
};

/** Light stays soft. Dark is blurred a little more so the glow does not fight the thread. */
const backdropBlur = { light: 8, dark: 12 } as const;

const Backdrop = memo(function Backdrop({ night }: { night: boolean }) {
  return (
    <Image
      source={night ? backdrop.dark : backdrop.light}
      blurRadius={night ? backdropBlur.dark : backdropBlur.light}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    />
  );
});

/** Taurus tab: streaming chat with conversation history. */
export function TaurusScreen() {
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome.danger);
  const night = scheme === "dark";

  const taurus = useTaurusConversations();
  const trail = useTaurusTrail();
  const [historyOpen, setHistoryOpen] = useState(false);
  const { conversation } = taurus;

  return (
    <View style={styles.fill}>
      <Backdrop night={night} />
      <Screen
        edges={["top"]}
        style={styles.screen}
        contentStyle={[styles.content, { paddingBottom: tabBarClearance(insets.bottom) }]}
      >
        <TaurusHeader
          newDisabled={taurus.isWorking}
          onChats={() => setHistoryOpen(true)}
          onNew={() => void taurus.startNewChat()}
        />

        {trail ? <TaurusStatusRow status={trail} /> : null}
        {taurus.error ? <Text style={styles.error}>{taurus.error}</Text> : null}

        {taurus.isLoading ? <LoadingBlock label="Opening chat…" /> : null}
        {taurus.loadError ? (
          <EmptyState
            title="Taurus unavailable"
            body={getErrorMessage(taurus.loadError, "Could not open your conversation.")}
            actionLabel="Try again"
            onAction={() => void taurus.refetch()}
          />
        ) : null}
        {conversation ? (
          <ChatPane
            key={conversation.id}
            conversationId={conversation.id}
            initialMessages={conversation.messages}
            activityAt={conversation.updatedAt}
          />
        ) : null}

        {historyOpen ? (
          <ConversationsSheet
            conversations={taurus.conversations}
            activeId={conversation?.id ?? null}
            busy={taurus.isWorking}
            onSelect={taurus.openConversation}
            onDelete={taurus.deleteConversation}
            onNewChat={() => {
              setHistoryOpen(false);
              void taurus.startNewChat();
            }}
            onClose={() => setHistoryOpen(false)}
          />
        ) : null}
      </Screen>
    </View>
  );
}

function createStyles(danger: string) {
  return StyleSheet.create({
    fill: { flex: 1 },
    screen: { flex: 1, backgroundColor: "transparent" },
    content: {
      flex: 1,
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    error: { fontFamily: typography.bodyMedium, color: danger },
  });
}
