import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  showBack = true,
}: ScreenHeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrap}>
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
        >
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  back: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: colors.inkMuted,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 28,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.inkMuted,
  },
});
}
