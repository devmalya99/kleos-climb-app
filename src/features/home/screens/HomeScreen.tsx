import { router, type Href } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { tabBarClearance } from "@/app/navigation/tabBar";
import { spacing, typography, useTheme } from "@/app/theme";
import { resolveDisplayName, useAuth } from "@/features/auth";
import { clutterHref } from "@/features/brain-clutter";
import { SuggestedTaskCard, useSuggestedTask } from "@/features/task-manager";

import { homeDateLabel, homeGreeting, homeScene } from "../utils/homeScene";

export function HomeScreen() {
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const suggestion = useSuggestedTask();
  const scene = homeScene(scheme);

  return (
    <ImageBackground source={scene} resizeMode="cover" style={styles.fill}>
      <SafeAreaView style={styles.fill} edges={["top"]}>
        <View style={[styles.content, { paddingBottom: tabBarClearance(insets.bottom) }]}>
          <View style={styles.header}>
            <Text style={styles.greeting}>{homeGreeting(scheme, resolveDisplayName(user))}</Text>
            <Text style={styles.date}>{homeDateLabel(new Date())}</Text>
          </View>
          {suggestion.task ? (
            <SuggestedTaskCard
              task={suggestion.task}
              picking={suggestion.picking}
              error={suggestion.error}
              onOpen={() => router.navigate(clutterHref.tasks() as Href)}
              onAnother={suggestion.pickAnother}
            />
          ) : null}
          <View style={styles.fill} />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  header: { gap: 2 },
  greeting: {
    fontFamily: typography.bodyBold,
    fontSize: 32,
    letterSpacing: -0.6,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  date: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.92)",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
