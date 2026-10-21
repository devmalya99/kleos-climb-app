import * as Haptics from "expo-haptics";

/** Success/error feedback for a graded answer or attempt. */
export function playAnswerHaptic(correct: boolean) {
  void Haptics.notificationAsync(
    correct
      ? Haptics.NotificationFeedbackType.Success
      : Haptics.NotificationFeedbackType.Error,
  );
}

/** Light tap when an option is selected. */
export function playSelectHaptic() {
  void Haptics.selectionAsync();
}

/** Stronger pulse for a reward such as an elixir or an unlock. */
export function playRewardHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
