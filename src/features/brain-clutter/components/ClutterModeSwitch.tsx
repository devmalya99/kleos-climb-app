import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme } from "@/app/theme";
import { taskChrome, taskIcon, type TaskChrome } from "@/features/task-manager";
import { PressableScale } from "@/shared/components/PressableScale";

import { CLUTTER_HONEY, CLUTTER_MODES, type ClutterHoney, type ClutterMode } from "../constants/brainClutter.constants";

type ClutterModeSwitchProps = {
  mode: ClutterMode;
  onChange: (mode: ClutterMode) => void;
  onRename?: () => void;
  onDelete?: () => void;
};

export function ClutterModeSwitch({ mode, onChange, onRename, onDelete }: ClutterModeSwitchProps) {
  const { scheme } = useTheme();
  const night = scheme === "dark";
  const chrome = taskChrome(scheme);
  const honey = CLUTTER_HONEY[scheme];
  const styles = createStyles(chrome, honey);

  return (
    <View style={styles.row}>
      <View style={styles.modes}>
        {CLUTTER_MODES.map((item) => {
          const active = item.value === mode;
          return (
            <PressableScale
              key={item.value}
              accessibilityState={{ selected: active }}
              pressedScale={0.94}
              onPress={() => onChange(item.value)}
              style={[styles.pill, active ? styles.pillActive : null]}
            >
              <Text style={[styles.pillLabel, active ? styles.pillLabelActive : null]}>{item.label}</Text>
            </PressableScale>
          );
        })}
      </View>
      {onRename ? (
        <PressableScale accessibilityLabel="Rename category" pressedScale={0.94} onPress={onRename} style={styles.rename}>
          <SymbolView name={taskIcon("pencil", "edit")} tintColor={chrome.ink} size={13} />
          <Text style={styles.renameLabel}>Rename</Text>
        </PressableScale>
      ) : null}
      {onDelete ? (
        <PressableScale
          accessibilityLabel="Delete category"
          pressedScale={0.94}
          onPress={onDelete}
          style={night ? styles.deleteWide : styles.deleteIcon}
        >
          <SymbolView name={taskIcon("trash", "delete")} tintColor={chrome.danger} size={14} />
          {night ? <Text style={styles.deleteLabel}>Delete</Text> : null}
        </PressableScale>
      ) : null}
    </View>
  );
}

function createStyles(chrome: TaskChrome, honey: ClutterHoney) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    modes: { flex: 1, flexDirection: "row", gap: spacing.sm },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 36,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: chrome.outline,
      backgroundColor: chrome.card,
    },
    pillActive: { backgroundColor: honey.soft, borderColor: honey.soft },
    pillLabel: { fontFamily: typography.bodyMedium, fontSize: 14, color: chrome.ink },
    pillLabelActive: { fontFamily: typography.bodyBold, color: honey.ink },
    rename: {
      flexShrink: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      minHeight: 36,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: chrome.outline,
      paddingHorizontal: spacing.sm,
      backgroundColor: chrome.card,
    },
    renameLabel: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.ink },
    deleteIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.dangerSoft,
    },
    deleteWide: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      minHeight: 36,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      backgroundColor: chrome.dangerSoft,
    },
    deleteLabel: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.danger },
  });
}
