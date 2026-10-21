import { useState } from "react";
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";

import type { ClimbSession, ClimbStats } from "../types/climb.types";
import {
  climbChrome,
  formatClimbDate,
  formatMeters,
  summitKilometersLabel,
  windowDaysLabel,
  type ClimbChrome,
} from "../utils/climb-chrome";
import { SummitSwitcher } from "./SummitSwitcher";

type SymbolName = Extract<ComponentProps<typeof SymbolView>["name"], object>;

type ClimbHeaderProps = {
  goal: string;
  deadline: string;
  stats: ClimbStats;
  sessions: ClimbSession[];
  climbId: string;
  onOpenSummit: (id: string) => void;
  onNewSummit: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  deleting: boolean;
  canAddTask: boolean;
};

export function ClimbHeader({
  goal,
  deadline,
  stats,
  sessions,
  climbId,
  onOpenSummit,
  onNewSummit,
  onDelete,
  onAddTask,
  deleting,
  canAddTask,
}: ClimbHeaderProps) {
  const { scheme } = useTheme();
  const night = scheme === "dark";
  const chrome = climbChrome(scheme);
  const styles = createStyles(chrome);
  const overdue = stats.daysLeft < 0;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const summitKm = summitKilometersLabel();

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.kicker}>
          <View style={[styles.dot, night ? styles.dotCool : null]} />
          <Text style={styles.kickerLabel}>{night ? "Active target peak" : "Current ascent"}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Switch summit"
          onPress={() => setPickerOpen(true)}
          style={styles.switch}
        >
          <Text style={styles.switchLabel}>{night ? "Switch peak" : "Switch"}</Text>
          <SymbolView
            name={icon(night ? "chevron.right" : "chevron.down", night ? "chevron_right" : "expand_more")}
            tintColor={chrome.ink}
            size={14}
          />
        </Pressable>
      </View>
      <Text style={styles.goal} numberOfLines={2}>
        {goal}
      </Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Altitude</Text>
          <Text style={styles.statValue}>
            {formatMeters(stats.altitudeMeters)}
            {night ? " m" : ""}
          </Text>
          <Text style={styles.statHint}>{night ? `of ${summitKm}` : `/ ${summitKm}`}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Camps</Text>
          <Text style={styles.statValue}>
            {stats.clearedLevels} of {stats.totalLevels}
          </Text>
          {night ? <Text style={styles.statHintWarm}>{stats.progressPercent}% achieved</Text> : null}
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{night ? "Deadline" : "Window"}</Text>
          <Text style={[styles.statValue, overdue ? styles.overdue : null]}>
            {windowDaysLabel(stats.daysLeft)}
          </Text>
          {night ? <Text style={styles.statHint}>{formatClimbDate(deadline)}</Text> : null}
        </View>
      </View>
      <View style={styles.actions}>
        {canAddTask ? (
          <Pressable accessibilityRole="button" onPress={onAddTask} style={styles.add}>
            <Text style={styles.addLabel}>{night ? "+  Add expedition task" : "+  Add task to camp"}</Text>
          </Pressable>
        ) : (
          <Text style={styles.reached}>Summit reached</Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Expedition actions"
          onPress={() => setMenuOpen(true)}
          style={night ? styles.iconButton : styles.summit}
        >
          {night ? (
            <SymbolView name={icon("line.3.horizontal", "menu")} tintColor={chrome.ink} size={18} />
          ) : (
            <Text style={styles.summitLabel}>Expedition</Text>
          )}
        </Pressable>
      </View>
      <SheetModal visible={pickerOpen} title="Summits" onClose={() => setPickerOpen(false)}>
        <SummitSwitcher
          sessions={sessions}
          climbId={climbId}
          onOpen={(id) => {
            onOpenSummit(id);
            setPickerOpen(false);
          }}
        />
      </SheetModal>
      <SheetModal
        visible={menuOpen}
        title="Expedition"
        onClose={() => {
          setConfirmDelete(false);
          setMenuOpen(false);
        }}
      >
        <Button
          label="New expedition"
          variant="secondary"
          onPress={() => {
            setConfirmDelete(false);
            setMenuOpen(false);
            onNewSummit();
          }}
        />
        {confirmDelete ? (
          <>
            <Text style={styles.deleteWarning}>
              This deletes the entire expedition, including every camp and task. Other expeditions stay.
            </Text>
            <Button
              label="Delete expedition"
              variant="danger"
              loading={deleting}
              onPress={() => {
                onDelete();
                setConfirmDelete(false);
                setMenuOpen(false);
              }}
            />
            <Button label="Cancel" variant="ghost" onPress={() => setConfirmDelete(false)} />
          </>
        ) : (
          <Button
            label="Delete expedition"
            variant="danger"
            onPress={() => setConfirmDelete(true)}
          />
        )}
      </SheetModal>
    </View>
  );
}

function icon(ios: NonNullable<SymbolName["ios"]>, android: NonNullable<SymbolName["android"]>) {
  return { ios, android, web: android } as const;
}

function createStyles(chrome: ClimbChrome) {
  return StyleSheet.create({
    card: {
      backgroundColor: chrome.card,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: chrome.cardBorder,
      padding: spacing.md,
      gap: spacing.md,
    },
    top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
    kicker: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: chrome.honey },
    dotCool: { backgroundColor: chrome.lineAhead },
    kickerLabel: {
      fontFamily: typography.bodyMedium,
      fontSize: 11,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: chrome.muted,
    },
    switch: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderWidth: 1,
      borderColor: chrome.outline,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
    },
    switchLabel: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.ink },
    goal: {
      fontFamily: typography.bodyBold,
      fontSize: 26,
      letterSpacing: -0.4,
      color: chrome.ink,
    },
    stats: { flexDirection: "row", gap: spacing.sm },
    stat: {
      flex: 1,
      backgroundColor: chrome.stat,
      borderRadius: radius.md,
      padding: spacing.sm,
      gap: 2,
    },
    statLabel: {
      fontFamily: typography.bodyMedium,
      fontSize: 10,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: chrome.muted,
    },
    statValue: { fontFamily: typography.bodyBold, fontSize: 15, color: chrome.ink },
    statHint: { fontFamily: typography.body, fontSize: 11, color: chrome.muted },
    statHintWarm: { fontFamily: typography.bodyMedium, fontSize: 11, color: chrome.honey },
    overdue: { color: "#E15B64" },
    actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    add: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.pill,
      backgroundColor: chrome.honey,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
    },
    addLabel: { fontFamily: typography.bodyBold, fontSize: 15, color: chrome.honeyInk },
    summit: {
      minHeight: 48,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: chrome.outline,
      paddingHorizontal: spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    summitLabel: { fontFamily: typography.bodyBold, fontSize: 15, color: chrome.ink },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: chrome.iconButton,
      borderWidth: 1,
      borderColor: chrome.outline,
      alignItems: "center",
      justifyContent: "center",
    },
    reached: {
      flex: 1,
      fontFamily: typography.bodyBold,
      fontSize: 16,
      color: chrome.positive,
    },
    deleteWarning: {
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 22,
      color: chrome.muted,
    },
  });
}
