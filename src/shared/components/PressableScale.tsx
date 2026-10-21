import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import {
  Pressable,
  type AccessibilityRole,
  type AccessibilityState,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const PRESS_IN = { damping: 18, stiffness: 420, mass: 0.4 };
const PRESS_OUT = { damping: 14, stiffness: 260, mass: 0.45 };

type PressableScaleProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Styles for the touch target. Use this when the control must fill a row. */
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  hitSlop?: number | Insets;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  haptic?: boolean;
  pressedScale?: number;
};

/** Spring scale plus a light tap. Shared by buttons, chips, and row actions. */
export function PressableScale({
  children,
  onPress,
  disabled = false,
  containerStyle,
  style,
  hitSlop,
  accessibilityRole = "button",
  accessibilityLabel,
  accessibilityState,
  haptic = true,
  pressedScale = 0.96,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ ...accessibilityState, disabled }}
      disabled={disabled}
      hitSlop={hitSlop}
      style={containerStyle}
      onPressIn={() => {
        scale.value = withSpring(pressedScale, PRESS_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_OUT);
      }}
      onPress={() => {
        if (haptic) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.();
      }}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
