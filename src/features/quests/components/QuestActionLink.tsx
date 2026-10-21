import { Pressable, StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";

type QuestActionLinkProps = {
  label: string;
  onPress: () => void;
  tone?: "default" | "danger" | "accent";
  disabled?: boolean;
};

export function QuestActionLink({
  label,
  onPress,
  tone = "default",
  disabled = false,
}: QuestActionLinkProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={disabled ? styles.disabled : undefined}
    >
      <Text
        style={[
          styles.label,
          tone === "danger" ? styles.danger : null,
          tone === "accent" ? styles.accent : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  label: {
    fontFamily: typography.bodyBold,
    fontSize: 13,
    color: colors.inkMuted,
  },
  danger: { color: colors.danger },
  accent: { color: colors.ink, textDecorationLine: "underline" },
  disabled: { opacity: 0.35 },
});
}
