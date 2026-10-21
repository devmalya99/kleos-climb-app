import { ReactNode } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

type ResultOverlayProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  tone?: "success" | "danger" | "neutral";
  children?: ReactNode;
  /** Buttons rendered under the content. */
  actions?: ReactNode;
  onRequestClose?: () => void;
};

/** Full-screen result card used by quiz, analyser, Colosseum and unlock celebrations. */
export function ResultOverlay({
  visible,
  title,
  subtitle,
  tone = "neutral",
  children,
  actions,
  onRequestClose,
}: ResultOverlayProps) {
  const { colors } = useTheme();
  const toneStyles = createToneStyles(colors);
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, toneStyles[tone]]}>
          <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            {children}
          </ScrollView>
          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

function createToneStyles(colors: AppColors) {
  return StyleSheet.create({
  success: { borderColor: colors.success },
  danger: { borderColor: colors.danger },
  neutral: { borderColor: colors.accent },
});
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    maxHeight: "90%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 2,
    padding: spacing.lg,
    gap: spacing.md,
  },
  body: { gap: spacing.md },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 28,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkMuted,
  },
  actions: { gap: spacing.sm },
});
}
