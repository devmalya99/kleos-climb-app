import { useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "@/app/theme";
import type { ClimbSession } from "@/features/mountain-climber";

type SceneFrame = { x: number; y: number; width: number; height: number };

type SummitStripProps = {
  sessions: ClimbSession[];
  activeId: string | null;
  scene: number;
  frame: SceneFrame;
  onSelect: (id: string) => void;
};

export function SummitStrip({ sessions, activeId, scene, frame, onSelect }: SummitStripProps) {
  const stripRef = useRef<View>(null);
  const [scrollX, setScrollX] = useState(0);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  if (sessions.length === 0) return null;

  return (
    <View
      ref={stripRef}
      onLayout={() => {
        stripRef.current?.measureInWindow((x, y) => {
          setOrigin((current) => {
            const next = { x: Math.round(x), y: Math.round(y) };
            return current.x === next.x && current.y === next.y ? current : next;
          });
        });
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroller}
        contentContainerStyle={styles.row}
        scrollEventThrottle={32}
        onScroll={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x);
          setScrollX((current) => (current === next ? current : next));
        }}
      >
      {sessions.map((session) => (
        <SummitCard
          key={session.id}
          session={session}
          selected={session.id === activeId}
          scene={scene}
          frame={frame}
          origin={origin}
          scrollX={scrollX}
          onSelect={onSelect}
        />
      ))}
      </ScrollView>
    </View>
  );
}

function SummitCard({
  session,
  selected,
  scene,
  frame,
  origin,
  scrollX,
  onSelect,
}: {
  session: ClimbSession;
  selected: boolean;
  scene: number;
  frame: SceneFrame;
  origin: { x: number; y: number };
  scrollX: number;
  onSelect: (id: string) => void;
}) {
  const [contentX, setContentX] = useState(0);
  const screenX = origin.x + contentX - scrollX;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onSelect(session.id)}
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.x);
        setContentX((current) => (current === next ? current : next));
      }}
      style={[styles.card, selected ? styles.selected : null]}
    >
      {frame.width > 0 ? (
        <Image
          source={scene}
          blurRadius={8}
          resizeMode="cover"
          style={{
            position: "absolute",
            width: frame.width,
            height: frame.height,
            left: frame.x - screenX,
            top: frame.y - origin.y,
          }}
        />
      ) : null}
      <Text style={styles.goal} numberOfLines={1}>
        {session.goal}
      </Text>
      <Text style={styles.meta}>
        {session.clearedLevels}/{session.totalLevels} camps
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroller: { flexGrow: 0 },
  row: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: 168,
    overflow: "hidden",
    gap: 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
  },
  selected: {
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  goal: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  meta: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.92)",
  },
});
