import { SymbolView } from "expo-symbols";
import { router, useFocusEffect, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Screen } from "@/shared/components/Screen";

import { ClutterSearchSheet } from "../components/ClutterSearchSheet";
import { GroupsPanel } from "../components/GroupsPanel";
import { clutterHref } from "../constants/brainClutter.constants";

/** Notes tab: buckets and notes, separate from Tasks. */
export function NotesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unloadDismissed, setUnloadDismissed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => setUnloadDismissed(false);
    }, []),
  );

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search notes"
          onPress={() => setSearchOpen(true)}
          style={styles.iconButton}
        >
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            tintColor={colors.ink}
            size={16}
          />
        </Pressable>
      </View>
      <View style={styles.body}>
        <GroupsPanel
          showFirstUnload={!unloadDismissed}
          onDismissFirstUnload={() => setUnloadDismissed(true)}
        />
      </View>
      <ClutterSearchSheet
        visible={searchOpen}
        scope="notes"
        onClose={() => setSearchOpen(false)}
        onOpenNote={(groupId) => {
          setSearchOpen(false);
          router.push(clutterHref.group(groupId));
        }}
        onOpenTask={(categoryId) => {
          setSearchOpen(false);
          router.navigate(clutterHref.tasks(categoryId) as Href);
        }}
      />
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    content: { gap: spacing.md },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    title: {
      flexShrink: 1,
      fontFamily: typography.bodyBold,
      fontSize: 32,
      letterSpacing: -0.6,
      color: colors.ink,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.border,
    },
    body: { flex: 1 },
  });
}
