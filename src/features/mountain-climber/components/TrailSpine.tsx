import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography } from "@/app/theme";

import { SUMMIT_ALTITUDE_METERS } from "../constants/climb.constants";
import { formatMeters, type ClimbChrome } from "../utils/climb-chrome";
import type { LevelStatus } from "./TrailLevelCard";

export function PeakRow({
  goal,
  reached,
  chrome,
  night,
}: {
  goal: string;
  reached: boolean;
  chrome: ClimbChrome;
  night: boolean;
}) {
  const styles = createStyles(chrome);
  return (
    <View style={styles.row}>
      <View style={styles.spine}>
        <View style={[styles.segment, { backgroundColor: chrome.lineAhead }]} />
        <View style={[styles.node, styles.peakNode]}>
          <SymbolView
            name={
              night
                ? { ios: "moon.fill", android: "dark_mode", web: "dark_mode" }
                : { ios: "flag.fill", android: "flag", web: "flag" }
            }
            tintColor={night ? chrome.lineAhead : chrome.honey}
            size={14}
          />
        </View>
      </View>
      <View style={styles.peakCard}>
        <View style={styles.peakTop}>
          <Text style={styles.peakBadge}>{night ? "Peak pinnacle" : "Final peak"}</Text>
          <Text style={styles.peakMeters}>{formatMeters(SUMMIT_ALTITUDE_METERS)} m</Text>
          {reached ? null : (
            <View style={styles.locked}>
              <Text style={styles.lockedLabel}>Locked</Text>
            </View>
          )}
        </View>
        <Text style={styles.peakTitle} numberOfLines={2}>
          {night ? goal : `Summit: ${goal}`}
        </Text>
        {reached ? <Text style={styles.reached}>Reached</Text> : null}
      </View>
    </View>
  );
}

export function CampRail({
  status,
  number,
  chrome,
}: {
  status: LevelStatus;
  number: number;
  chrome: ClimbChrome;
}) {
  const styles = createStyles(chrome);
  const walked = status !== "ahead";
  const current = status === "current";
  return (
    <View style={styles.spine}>
      <View
        style={[styles.segment, { backgroundColor: walked ? chrome.lineWalked : chrome.lineAhead }]}
      />
      <View
        style={[
          styles.node,
          current ? styles.nodeCurrent : walked ? styles.nodeWalked : null,
        ]}
      >
        <Text
          style={[
            styles.nodeText,
            current ? styles.nodeTextCurrent : walked ? styles.nodeTextWalked : null,
          ]}
        >
          {number}
        </Text>
      </View>
    </View>
  );
}

function createStyles(chrome: ClimbChrome) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "stretch", gap: spacing.sm },
    spine: { width: 32, alignItems: "center" },
    segment: { width: 2, flex: 1, minHeight: 12 },
    node: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.nodeIdle,
      borderColor: chrome.nodeIdleBorder,
    },
    peakNode: { borderColor: chrome.lineAhead, backgroundColor: chrome.page },
    nodeCurrent: { backgroundColor: chrome.honey, borderColor: chrome.honey },
    nodeWalked: { backgroundColor: chrome.positive, borderColor: chrome.positive },
    nodeText: { fontFamily: typography.bodyBold, fontSize: 13, color: chrome.nodeIdleInk },
    nodeTextCurrent: { color: chrome.honeyInk },
    nodeTextWalked: { color: "#FFFFFF" },
    peakCard: {
      flex: 1,
      backgroundColor: chrome.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: chrome.cardBorder,
      padding: spacing.md,
      gap: spacing.sm,
      marginVertical: spacing.sm,
    },
    peakTop: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
    peakBadge: {
      fontFamily: typography.bodyBold,
      fontSize: 10,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: chrome.badgeInk,
      backgroundColor: chrome.badge,
      borderRadius: radius.pill,
      overflow: "hidden",
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    peakMeters: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.muted },
    locked: {
      marginLeft: "auto",
      backgroundColor: chrome.locked,
      borderRadius: radius.pill,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    lockedLabel: { fontFamily: typography.bodyMedium, fontSize: 11, color: chrome.lockedInk },
    peakTitle: { fontFamily: typography.bodyBold, fontSize: 17, lineHeight: 22, color: chrome.ink },
    reached: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.positive },
  });
}
