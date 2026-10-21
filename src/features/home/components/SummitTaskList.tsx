import { ScrollView, StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "@/app/theme";
import type { ClimbLevel } from "@/features/mountain-climber";

const ROW_HEIGHT = 56;
const VISIBLE_ROWS = 2;

type SummitTaskListProps = {
  levels: ClimbLevel[];
  ink: string;
  muted: string;
};

function statusLabel(level: ClimbLevel, current: boolean): string {
  if (level.completedAt) return "Cleared";
  if (current) return "In progress";
  return "To do";
}

export function SummitTaskList({ levels, ink, muted }: SummitTaskListProps) {
  const currentIndex = levels.findIndex((level) => level.completedAt === null);
  const start = currentIndex === -1 ? 0 : currentIndex;
  const ordered = [...levels.slice(start), ...levels.slice(0, start)];

  if (ordered.length === 0) {
    return <Text style={[styles.empty, { color: muted }]}>This summit has no tasks yet.</Text>;
  }

  return (
    <ScrollView
      style={styles.list}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {ordered.map((level, index) => {
        const current = currentIndex !== -1 && level.id === levels[currentIndex]?.id;
        return (
          <View key={level.id} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.dot, { borderColor: ink, backgroundColor: current ? ink : "transparent" }]} />
              {index < ordered.length - 1 ? <View style={[styles.line, { backgroundColor: muted }]} /> : null}
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, { color: ink }]} numberOfLines={1}>
                {level.title}
              </Text>
              <Text style={[styles.status, { color: muted }]} numberOfLines={1}>
                {statusLabel(level, current)}
              </Text>
            </View>
            <Text style={[styles.progress, { color: ink }]}>
              {level.completedAt ? "Done" : `${level.progress}%`}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { height: ROW_HEIGHT * VISIBLE_ROWS },
  empty: {
    height: ROW_HEIGHT * VISIBLE_ROWS,
    fontFamily: typography.body,
    fontSize: 15,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rail: { width: 18, alignItems: "center", alignSelf: "stretch" },
  dot: {
    width: 14,
    height: 14,
    marginTop: 10,
    borderRadius: 7,
    borderWidth: 2,
  },
  line: { width: 2, flex: 1, marginTop: 4 },
  copy: { flex: 1, gap: 2 },
  title: { fontFamily: typography.bodyBold, fontSize: 16 },
  status: { fontFamily: typography.body, fontSize: 13 },
  progress: { fontFamily: typography.bodyMedium, fontSize: 13 },
});
