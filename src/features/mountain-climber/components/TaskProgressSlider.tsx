import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

import { completionColor } from "../utils/completion-color";

const THUMB = 22;

type TaskProgressSliderProps = {
  taskTitle: string;
  progress: number;
  disabled: boolean;
  onCommit: (progress: number) => void;
};

function progressFromX(x: number, width: number): number {
  if (width <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((x / width) * 100)));
}

export function TaskProgressSlider({
  taskTitle,
  progress,
  disabled,
  onCommit,
}: TaskProgressSliderProps) {
  const { colors, scheme } = useTheme();
  const styles = createStyles(colors, scheme);
  const [draft, setDraft] = useState(progress);
  const widthRef = useRef(1);
  const draftRef = useRef(progress);
  const progressRef = useRef(progress);
  const disabledRef = useRef(disabled);
  const onCommitRef = useRef(onCommit);
  progressRef.current = progress;
  disabledRef.current = disabled;
  onCommitRef.current = onCommit;

  useEffect(() => {
    draftRef.current = progress;
    setDraft(progress);
  }, [progress]);

  const shown = disabled ? progress : draft;

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-6, 6])
        .failOffsetY([-14, 14])
        .onUpdate((event) => {
          if (disabledRef.current) return;
          const next = progressFromX(event.x, widthRef.current);
          if (next === draftRef.current) return;
          draftRef.current = next;
          setDraft(next);
          if (next === 100) {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return;
          }
          void Haptics.selectionAsync();
        })
        .onEnd(() => {
          const next = draftRef.current;
          if (disabledRef.current || next === progressRef.current) return;
          onCommitRef.current(next);
        }),
    [],
  );

  const color = completionColor(shown);

  const track = (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`Completion for ${taskTitle}`}
      accessibilityValue={{ min: 0, max: 100, now: shown, text: `${shown} percent` }}
      accessibilityActions={disabled ? undefined : [{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        if (disabled) return;
        const delta = event.nativeEvent.actionName === "increment" ? 1 : -1;
        const next = Math.max(0, Math.min(100, progressRef.current + delta));
        if (next === progressRef.current) return;
        draftRef.current = next;
        setDraft(next);
        if (next === 100) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        onCommit(next);
      }}
      onLayout={(event) => {
        widthRef.current = event.nativeEvent.layout.width;
      }}
      style={styles.hit}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${shown}%`, backgroundColor: color }]} />
      </View>
      <View
        pointerEvents="none"
        style={[styles.thumb, { left: `${shown}%`, backgroundColor: color }]}
      />
    </View>
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.caption}>
        <Text style={styles.captionLabel}>Completion</Text>
        <Text style={styles.captionValue}>{shown}%</Text>
      </View>
      {disabled ? track : <GestureDetector gesture={pan}>{track}</GestureDetector>}
    </View>
  );
}

function createStyles(colors: AppColors, scheme: "light" | "dark") {
  const trackColor = scheme === "light" ? colors.ink : colors.bgMuted;
  return StyleSheet.create({
    wrap: { gap: spacing.xs },
    caption: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    captionLabel: {
      fontFamily: typography.body,
      fontSize: 12,
      color: colors.inkMuted,
    },
    captionValue: {
      fontFamily: typography.bodyBold,
      fontSize: 12,
      color: colors.ink,
    },
    hit: {
      height: 44,
      justifyContent: "center",
    },
    track: {
      height: 8,
      borderRadius: radius.sm,
      backgroundColor: trackColor,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
    },
    thumb: {
      position: "absolute",
      width: THUMB,
      height: THUMB,
      marginLeft: -THUMB / 2,
      borderRadius: THUMB / 2,
      borderWidth: 2,
      borderColor: colors.surfaceCard,
    },
  });
}
