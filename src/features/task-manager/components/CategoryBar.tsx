import { SymbolView } from "expo-symbols";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import type { TaskCategory } from "../types/taskManager.types";
import { taskChrome, taskIcon, type TaskChrome } from "../utils/taskChrome";

type CategoryBarProps = {
  categories: TaskCategory[];
  activeId: string | null;
  onSelect: (categoryId: string) => void;
  onAdd: () => void;
};

export function CategoryBar({ categories, activeId, onSelect, onAdd }: CategoryBarProps) {
  const { scheme } = useTheme();
  const chrome = taskChrome(scheme);
  const styles = createStyles(chrome);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const selected = category.id === activeId;
        return (
          <PressableScale
            key={category.id}
            accessibilityState={{ selected }}
            accessibilityLabel={`${category.name}, ${category.taskCount} tasks`}
            pressedScale={0.96}
            onPress={() => onSelect(category.id)}
            style={[styles.card, selected ? styles.cardSelected : null]}
          >
            <View style={[styles.iconWell, selected ? styles.iconWellSelected : null]}>
              <SymbolView
                name={iconForCategory(category.name)}
                tintColor={selected ? chrome.honeyInk : chrome.ink}
                size={16}
              />
            </View>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {category.name}
              </Text>
              {selected ? <View style={styles.dot} /> : null}
            </View>
            <Text style={styles.count}>{taskCountLabel(category.taskCount)}</Text>
          </PressableScale>
        );
      })}
      <PressableScale accessibilityLabel="New category" pressedScale={0.94} onPress={onAdd} style={styles.add}>
        <SymbolView name={taskIcon("plus", "add")} tintColor={chrome.ink} size={16} />
        <Text style={styles.addLabel}>New</Text>
      </PressableScale>
    </ScrollView>
  );
}

function taskCountLabel(count: number): string {
  return `${count} ${count === 1 ? "task" : "tasks"}`;
}

function iconForCategory(name: string) {
  const normalized = name.toLowerCase();
  if (/\b(python|django|flask)\b|\bpy\b/.test(normalized)) {
    return taskIcon("chevron.left.forwardslash.chevron.right", "code");
  }
  if (/\b(dsa|algo|algorithm|graph)\b/.test(normalized)) {
    return taskIcon("square.stack.3d.up", "layers");
  }
  return taskIcon("folder.fill", "folder");
}

function createStyles(chrome: TaskChrome) {
  return StyleSheet.create({
    row: { gap: spacing.sm, paddingVertical: 2 },
    card: {
      width: 148,
      gap: spacing.sm,
      padding: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: chrome.cardBorder,
      backgroundColor: chrome.card,
    },
    cardSelected: { borderColor: chrome.honey },
    iconWell: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.iconWell,
    },
    iconWellSelected: { backgroundColor: chrome.honey },
    nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    name: { flexShrink: 1, fontFamily: typography.bodyBold, fontSize: 15, color: chrome.ink },
    dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: chrome.honey },
    count: { fontFamily: typography.body, fontSize: 12, color: chrome.muted },
    add: {
      width: 88,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: chrome.outline,
      backgroundColor: chrome.card,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    addLabel: { fontFamily: typography.bodyMedium, fontSize: 13, color: chrome.ink },
  });
}
