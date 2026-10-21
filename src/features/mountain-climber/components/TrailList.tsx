import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme } from "@/app/theme";

import type { Climb } from "../types/climb.types";
import { campAltitudeMeters, climbChrome, type ClimbChrome } from "../utils/climb-chrome";
import { CampDrag } from "./CampDrag";
import { CampRail, PeakRow } from "./TrailSpine";
import { TrailLevelCard, type LevelStatus } from "./TrailLevelCard";

type TrailListProps = {
  climb: Climb;
  currentLevelIndex: number;
  onClear: () => void;
  onUndo: () => void;
  onRemove: (levelId: string) => void;
  onEdit: (levelId: string, title: string, description: string) => void;
  onProgress: (levelId: string, progress: number) => void;
  onMove: (activeId: string, overId: string) => void;
  onDraggingChange: (dragging: boolean) => void;
  registerCard: (id: string, node: View | null) => void;
};

function statusFor(index: number, currentLevelIndex: number): LevelStatus {
  if (currentLevelIndex === -1 || index < currentLevelIndex) return "cleared";
  return index === currentLevelIndex ? "current" : "ahead";
}

/** Summit at the top, base camp at the bottom. Index 0 is camp 1. */
export function TrailList({
  climb,
  currentLevelIndex,
  onClear,
  onUndo,
  onRemove,
  onEdit,
  onProgress,
  onMove,
  onDraggingChange,
  registerCard,
}: TrailListProps) {
  const { scheme } = useTheme();
  const night = scheme === "dark";
  const chrome = climbChrome(scheme);
  const styles = createStyles(chrome);
  const [arranging, setArranging] = useState(false);

  const lastClearedIndex = (currentLevelIndex === -1 ? climb.levels.length : currentLevelIndex) - 1;
  const pendingIds = climb.levels.filter((level) => level.completedAt === null).map((level) => level.id);
  const topDown = climb.levels.map((level, index) => ({ level, index })).reverse();
  const canArrange = pendingIds.length > 1;
  const summitReached = currentLevelIndex === -1 && climb.levels.length > 0;

  function toggleArrange() {
    setArranging((current) => {
      if (current) onDraggingChange(false);
      return !current;
    });
  }

  return (
    <View style={styles.frame}>
      <View style={styles.mapBar}>
        <View style={styles.mapTitleRow}>
          {night ? <View style={styles.mapDot} /> : null}
          <Text style={styles.mapTitle}>{night ? "Ascent route map" : "Ascent trail map"}</Text>
        </View>
        {canArrange ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: arranging }}
            onPress={toggleArrange}
            style={styles.arrange}
          >
            <Text style={styles.arrangeLabel}>
              {arranging ? "Done" : night ? "Reorder camps" : "Reorder"}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.hint}>
        {night
          ? "Drag open camps along the trail. Cleared camps stay anchored to ridge points."
          : "Drag unlocked camps to reorder difficulty."}
      </Text>
      <View>
        <PeakRow goal={climb.goal} reached={summitReached} chrome={chrome} night={night} />
        {topDown.map(({ level, index }) => {
          const status = statusFor(index, currentLevelIndex);
          const pending = level.completedAt === null;
          const pendingVisualIndex = pendingIds.length - 1 - pendingIds.indexOf(level.id);
          const row = (
            <View
              ref={(node) => registerCard(level.id, node)}
              collapsable={false}
              style={styles.row}
            >
              <CampRail status={status} number={index + 1} chrome={chrome} />
              <TrailLevelCard
                level={level}
                levelNumber={index + 1}
                altitudeMeters={campAltitudeMeters(index, climb.levels.length)}
                status={status}
                isLastCleared={index === lastClearedIndex}
                canRemove={pending && climb.levels.length > 1}
                arranging={arranging}
                chrome={chrome}
                onClear={onClear}
                onUndo={onUndo}
                onRemove={() => onRemove(level.id)}
                onEdit={(title, description) => onEdit(level.id, title, description)}
                onProgress={(progress) => onProgress(level.id, progress)}
              />
            </View>
          );

          return (
            <CampDrag
              key={level.id}
              enabled={arranging && pending}
              visualIndex={pending ? pendingVisualIndex : 0}
              slotCount={pendingIds.length}
              levelId={level.id}
              orderedIds={pendingIds}
              onMove={onMove}
              onDragging={onDraggingChange}
            >
              {row}
            </CampDrag>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(chrome: ClimbChrome) {
  return StyleSheet.create({
    frame: { gap: spacing.sm },
    mapBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    mapTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
    mapDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: chrome.lineAhead },
    mapTitle: {
      fontFamily: typography.bodyBold,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: chrome.muted,
    },
    arrange: {
      borderWidth: 1,
      borderColor: chrome.outline,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      backgroundColor: chrome.card,
    },
    arrangeLabel: { fontFamily: typography.bodyBold, fontSize: 13, color: chrome.ink },
    hint: { fontFamily: typography.body, fontSize: 13, lineHeight: 18, color: chrome.muted },
    row: { flexDirection: "row", alignItems: "stretch", gap: spacing.sm },
  });
}
