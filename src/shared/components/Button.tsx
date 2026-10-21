import { ActivityIndicator, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

import { PressableScale } from "./PressableScale";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isDisabled = disabled || loading;

  return (
    <PressableScale
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.base, styles[variant], isDisabled ? styles.disabled : null, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.accentInk : colors.ink}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "primary"
              ? styles.labelPrimary
              : variant === "ghost"
                ? styles.labelGhost
                : styles.labelDefault,
            variant === "danger" ? styles.labelDanger : null,
          ]}
        >
          {label}
        </Text>
      )}
    </PressableScale>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.accentFill,
  },
  secondary: {
    backgroundColor: colors.bgElevated,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
  },
  labelPrimary: {
    color: colors.accentInk,
  },
  labelDefault: {
    color: colors.ink,
  },
  labelGhost: {
    color: colors.ink,
  },
  labelDanger: {
    color: colors.onFill,
  },
});
}
