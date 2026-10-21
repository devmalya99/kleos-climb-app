import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";

export function WelcomeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Screen style={styles.root} contentStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.brand}>PACEMAKER</Text>
        <Text style={styles.headline}>Train like the exam is tomorrow.</Text>
        <Text style={styles.sub}>
          Campaigns, quests, arenas, and an AI study partner — one athletic study
          game on your phone.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button label="Log in" onPress={() => router.push("/(auth)/login")} />
        <Button
          label="Create account"
          variant="secondary"
          onPress={() => router.push("/(auth)/signup")}
        />
      </View>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    backgroundColor: colors.bg,
  },
  content: {
    justifyContent: "space-between",
    paddingVertical: spacing.xl,
  },
  hero: {
    gap: spacing.md,
    paddingTop: spacing.xxl,
  },
  brand: {
    fontFamily: typography.display,
    fontSize: 56,
    color: colors.accent,
    letterSpacing: 2,
  },
  headline: {
    fontFamily: typography.bodyBold,
    fontSize: 28,
    color: colors.ink,
    lineHeight: 34,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.inkSubtle,
    lineHeight: 24,
    maxWidth: 320,
  },
  actions: {
    gap: spacing.sm,
  },
});
}
