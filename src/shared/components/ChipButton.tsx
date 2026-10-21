import { StyleSheet, Text } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

import { PressableScale } from "./PressableScale";

type ChipButtonProps = {
  label: string;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
};

/** Compact pressable used for selectors, filters and inline row actions. */
export function ChipButton({
  label,
  onPress,
  active = false,
  danger = false,
  disabled = false,
}: ChipButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <PressableScale
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      pressedScale={0.94}
      style={[styles.chip, active ? styles.active : null, disabled ? styles.disabled : null]}
    >
      <Text
        style={[
          styles.label,
          active ? styles.labelActive : null,
          danger ? styles.labelDanger : null,
        ]}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  active: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  disabled: { opacity: 0.5 },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.ink,
  },
  labelActive: { color: colors.accent },
  labelDanger: { color: colors.danger },
});
}
