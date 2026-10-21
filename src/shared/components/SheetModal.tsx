import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

import { PressableScale } from "./PressableScale";

type SheetModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const OPEN_SPRING = { damping: 22, stiffness: 220, mass: 0.75 };
const CLOSE = { duration: 220, easing: Easing.in(Easing.cubic) };

export function SheetModal({ visible, title, onClose, children }: SheetModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [mounted, setMounted] = useState(visible);
  const closing = useRef(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      closing.current = false;
      setMounted(true);
      progress.value = withSpring(1, OPEN_SPRING);
      return;
    }
    if (closing.current) {
      setMounted(false);
      return;
    }
    progress.value = withTiming(0, CLOSE, (finished) => {
      if (finished) runOnJS(setMounted)(false);
    });
  }, [progress, visible]);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    progress.value = withTiming(0, CLOSE, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [onClose, progress]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 720 }],
  }));

  return (
    <Modal
      visible={mounted}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={requestClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        </Animated.View>
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <PressableScale accessibilityLabel="Close" hitSlop={12} onPress={requestClose}>
              <Text style={styles.close}>Close</Text>
            </PressableScale>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: { flex: 1, justifyContent: "flex-end" },
    backdrop: { ...StyleSheet.absoluteFill, backgroundColor: colors.overlay },
    sheet: {
      maxHeight: "88%",
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingTop: spacing.sm,
    },
    handle: {
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.borderStrong,
      marginBottom: spacing.sm,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.sm,
    },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 20,
      letterSpacing: -0.2,
      color: colors.ink,
    },
    close: { fontFamily: typography.bodyMedium, fontSize: 15, color: colors.inkMuted },
    body: { gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  });
}
