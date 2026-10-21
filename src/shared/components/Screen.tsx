import { ReactNode } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  type StyleProp,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing, useTheme, type AppColors } from "@/app/theme";

const SCREEN_ENTER = FadeInDown.duration(320).springify().damping(20).stiffness(170);

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ("top" | "bottom" | "left" | "right")[];
  /** Enables pull-to-refresh on scrolling screens. */
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function Screen({
  children,
  scroll = false,
  style,
  contentStyle,
  edges = ["top", "bottom"],
  onRefresh,
  refreshing = false,
}: ScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const body = scroll ? (
        <ScrollView
          style={styles.enter}
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
                colors={[colors.accentFill]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.root, style]} edges={edges}>
      <Animated.View entering={SCREEN_ENTER} style={styles.enter}>
        {body}
      </Animated.View>
    </SafeAreaView>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  enter: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
}
