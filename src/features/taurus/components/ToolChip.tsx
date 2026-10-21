import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { typography, useTheme } from "@/app/theme";

import type { TaurusPart } from "../types/taurus.types";
import { getToolLabel, isRunningTool } from "../utils/messageParts";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

type ToolChipProps = {
  part: TaurusPart;
};

/** Quiet status line for a tool that has not finished. Finished payloads stay hidden. */
export function ToolChip({ part }: ToolChipProps) {
  const { scheme } = useTheme();
  const styles = createStyles(taurusChrome(scheme));

  if (!isRunningTool(part)) return null;

  const label = getToolLabel(part);

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${label}, in progress`}
    >
      <Text style={styles.text}>{label}…</Text>
    </Animated.View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    text: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.muted },
  });
}
