import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { type LayoutChangeEvent } from "react-native";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type CampDragProps = {
  enabled: boolean;
  /** 0 is the camp nearest the summit. */
  visualIndex: number;
  slotCount: number;
  levelId: string;
  /** Pending camp ids from base toward the summit. */
  orderedIds: string[];
  onMove: (activeId: string, overId: string) => void;
  onDragging: (dragging: boolean) => void;
  children: ReactNode;
};

export function CampDrag({
  enabled,
  visualIndex,
  slotCount,
  levelId,
  orderedIds,
  onMove,
  onDragging,
  children,
}: CampDragProps) {
  const translateY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const rowHeight = useSharedValue(88);
  const lastSlot = useSharedValue(0);
  const visualIndexSv = useSharedValue(visualIndex);
  const slotCountSv = useSharedValue(slotCount);

  useEffect(() => {
    visualIndexSv.value = visualIndex;
    slotCountSv.value = slotCount;
  }, [slotCount, slotCountSv, visualIndex, visualIndexSv]);

  const latest = useRef({ visualIndex, slotCount, levelId, orderedIds, onMove, onDragging });
  latest.current = { visualIndex, slotCount, levelId, orderedIds, onMove, onDragging };

  function began() {
    latest.current.onDragging(true);
    void Haptics.selectionAsync();
  }

  function tick() {
    void Haptics.selectionAsync();
  }

  function released() {
    latest.current.onDragging(false);
  }

  function finish(slots: number) {
    const current = latest.current;
    const next = Math.max(0, Math.min(current.slotCount - 1, current.visualIndex + slots));
    if (next === current.visualIndex) return;
    const overId = current.orderedIds[current.orderedIds.length - 1 - next];
    if (!overId || overId === current.levelId) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    current.onMove(current.levelId, overId);
  }

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .activeOffsetY([-8, 8])
        .failOffsetX([-28, 28])
        .onStart(() => {
          dragging.value = true;
          lastSlot.value = 0;
          runOnJS(began)();
        })
        .onUpdate((event) => {
          const height = Math.max(rowHeight.value, 1);
          const minY = -visualIndexSv.value * height;
          const maxY = (slotCountSv.value - 1 - visualIndexSv.value) * height;
          const y = Math.min(maxY, Math.max(minY, event.translationY));
          translateY.value = y;
          const slot = Math.round(y / height);
          if (slot !== lastSlot.value) {
            lastSlot.value = slot;
            runOnJS(tick)();
          }
        })
        .onEnd(() => {
          const height = Math.max(rowHeight.value, 1);
          const slots = Math.round(translateY.value / height);
          translateY.value = 0;
          dragging.value = false;
          runOnJS(finish)(slots);
        })
        .onFinalize(() => {
          translateY.value = 0;
          dragging.value = false;
          runOnJS(released)();
        }),
    [enabled, dragging, lastSlot, rowHeight, slotCountSv, translateY, visualIndexSv],
  );

  const animated = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: dragging.value ? 20 : 0,
    elevation: dragging.value ? 12 : 0,
  }));

  function onLayout(event: LayoutChangeEvent) {
    rowHeight.value = event.nativeEvent.layout.height;
  }

  if (!enabled) return children;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animated} onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
