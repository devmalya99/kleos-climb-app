import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { spacing, typography, useTheme } from "@/app/theme";

import { TOOL_STATE } from "../constants/taurus.constants";
import type { TaurusPart } from "../types/taurus.types";
import { getToolLabel } from "../utils/messageParts";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

type ToolChipProps = {
  part: TaurusPart;
};

/** Small status line for a tool call: "get timetable…", "done" or "failed". */
export function ToolChip({ part }: ToolChipProps) {
  const { scheme } = useTheme();
  const styles = createStyles(taurusChrome(scheme));

  const failed = part.state === TOOL_STATE.OUTPUT_ERROR;
  const done = part.state === TOOL_STATE.OUTPUT_AVAILABLE;
  const label = getToolLabel(part);

  return (
    <Animated.View entering={FadeIn.duration(180)} style={styles.chip} accessibilityLiveRegion="polite">
      <Text style={[styles.text, failed ? styles.failed : null]}>
        {failed ? `✗ ${label} failed` : done ? `✓ ${label}` : `${label}…`}
      </Text>
    </Animated.View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    chip: {
      alignSelf: "flex-start",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 8,
      backgroundColor: chrome.cardRaised,
    },
    text: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.ink },
    failed: { color: chrome.danger },
  });
}
