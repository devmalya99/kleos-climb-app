import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/app/theme";

import type { ClimbLevel } from "../types/climb.types";
import { formatMeters, type ClimbChrome } from "../utils/climb-chrome";
import { CampSheet, type LevelStatus } from "./CampSheet";

export type { LevelStatus };

type TrailLevelCardProps = {
  level: ClimbLevel;
  levelNumber: number;
  altitudeMeters: number;
  status: LevelStatus;
  isLastCleared: boolean;
  canRemove: boolean;
  arranging: boolean;
  chrome: ClimbChrome;
  onClear: () => void;
  onUndo: () => void;
  onRemove: () => void;
  onEdit: (title: string, description: string) => void;
  onProgress: (progress: number) => void;
};

export function TrailLevelCard({
  level,
  levelNumber,
  altitudeMeters,
  status,
  isLastCleared,
  canRemove,
  arranging,
  chrome,
  onClear,
  onUndo,
  onRemove,
  onEdit,
  onProgress,
}: TrailLevelCardProps) {
  const styles = createStyles(chrome);
  const [open, setOpen] = useState(false);
  const current = status === "current";
  const meters = `${formatMeters(altitudeMeters)}m`;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Camp ${levelNumber}, ${level.title}`}
        disabled={arranging}
        onPress={() => setOpen(true)}
        style={[styles.card, current ? styles.current : null]}
      >
        <View style={styles.copy}>
          {current ? (
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>Current camp</Text>
              <Text style={styles.meters}>{meters}</Text>
              <View style={styles.active}>
                <Text style={styles.activeLabel}>Active</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.kicker}>
              Camp {levelNumber} · {meters}
            </Text>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {level.title}
          </Text>
          {arranging ? (
            <Text style={styles.meta}>{status === "cleared" ? "Planted" : "Drag"}</Text>
          ) : level.description ? (
            <Text style={styles.meta} numberOfLines={2}>
              {level.description}
            </Text>
          ) : null}
          {current && !arranging ? (
            <View style={styles.progressBlock}>
              <View style={styles.progressLabels}>
                <Text style={styles.meta}>Camp progress</Text>
                <Text style={styles.meta}>{level.progress}%</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${level.progress}%` }]} />
              </View>
            </View>
          ) : null}
          {status === "ahead" && !arranging ? (
            <View style={styles.locked}>
              <Text style={styles.lockedLabel}>Locked</Text>
            </View>
          ) : null}
          {status === "cleared" && !arranging ? <Text style={styles.cleared}>Cleared</Text> : null}
        </View>
        {arranging ? null : (
          <SymbolView
            name={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
            tintColor={chrome.muted}
            size={16}
          />
        )}
      </Pressable>
      <CampSheet
        visible={open}
        level={level}
        levelNumber={levelNumber}
        status={status}
        isLastCleared={isLastCleared}
        canRemove={canRemove}
        onClose={() => setOpen(false)}
        onClear={onClear}
        onUndo={onUndo}
        onRemove={onRemove}
        onEdit={onEdit}
        onProgress={onProgress}
      />
    </>
  );
}

function createStyles(chrome: ClimbChrome) {
  return StyleSheet.create({
    card: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      backgroundColor: chrome.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: chrome.cardBorder,
      padding: spacing.md,
      marginVertical: spacing.sm,
    },
    current: {
      borderColor: chrome.activeBorder,
      backgroundColor: chrome.activeWash,
    },
    copy: { flex: 1, gap: 6 },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
    badge: {
      fontFamily: typography.bodyBold,
      fontSize: 10,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: chrome.badgeInk,
      backgroundColor: chrome.badge,
      overflow: "hidden",
      borderRadius: radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    meters: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.muted },
    active: {
      marginLeft: "auto",
      backgroundColor: chrome.honey,
      borderRadius: radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    activeLabel: {
      fontFamily: typography.bodyBold,
      fontSize: 10,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: chrome.honeyInk,
    },
    kicker: {
      fontFamily: typography.bodyMedium,
      fontSize: 11,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: chrome.muted,
    },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 17,
      lineHeight: 22,
      color: chrome.ink,
    },
    meta: { fontFamily: typography.body, fontSize: 13, lineHeight: 18, color: chrome.muted },
    progressBlock: { gap: 6, marginTop: 2 },
    progressLabels: { flexDirection: "row", justifyContent: "space-between" },
    track: { height: 6, borderRadius: 3, backgroundColor: chrome.track, overflow: "hidden" },
    fill: { height: 6, borderRadius: 3, backgroundColor: chrome.honey },
    locked: {
      alignSelf: "flex-start",
      backgroundColor: chrome.locked,
      borderRadius: radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    lockedLabel: { fontFamily: typography.bodyMedium, fontSize: 11, color: chrome.lockedInk },
    cleared: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.positive },
  });
}
