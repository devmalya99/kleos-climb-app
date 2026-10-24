import { useRef, useState, type ReactNode } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { tabBarClearance } from "@/app/navigation/tabBar";
import { spacing, typography, useTheme } from "@/app/theme";
import { resolveDisplayName, useAuth } from "@/features/auth";
import { getErrorMessage } from "@/services/api";

import { SummitStrip } from "../components/SummitStrip";
import { SummitTaskList } from "../components/SummitTaskList";
import { useHomeSummits } from "../hooks/useHomeSummits";
import { homeDateLabel, homeGreeting, homeScene } from "../utils/homeScene";

export function HomeScreen() {
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const summits = useHomeSummits();
  const scene = homeScene(scheme);
  const night = scheme === "dark";
  const ink = night ? "#F4F7FB" : "#142033";
  const muted = night ? "rgba(244, 247, 251, 0.72)" : "rgba(20, 32, 51, 0.72)";
  const goal = summits.climb?.goal;
  const backdropRef = useRef<View>(null);
  const [frame, setFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });

  return (
    <View
      ref={backdropRef}
      style={styles.fill}
      onLayout={() => {
        const node = backdropRef.current;
        if (!node || typeof node.measureInWindow !== "function") return;
        node.measureInWindow((x, y, width, height) => {
          setFrame((current) => {
            const next = {
              x: Math.round(x),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height),
            };
            if (
              current.x === next.x &&
              current.y === next.y &&
              current.width === next.width &&
              current.height === next.height
            ) {
              return current;
            }
            return next;
          });
        });
      }}
    >
    <ImageBackground
      source={scene}
      resizeMode="cover"
      style={styles.fill}
    >
      <SafeAreaView style={styles.fill} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{homeGreeting(scheme, resolveDisplayName(user))}</Text>
          <Text style={styles.date}>{homeDateLabel(new Date())}</Text>
        </View>
        <View style={styles.fill} />
        <SummitStrip
          sessions={summits.sessions}
          activeId={summits.activeId}
          scene={scene}
          frame={frame}
          onSelect={summits.selectSummit}
        />
        <View style={styles.gap} />
      </SafeAreaView>
      <FrostedPanel source={scene} night={night} frame={frame} bottomInset={tabBarClearance(insets.bottom)}>
        <Text style={[styles.panelTitle, { color: ink }]} numberOfLines={1}>
          {goal ?? "Your summits"}
        </Text>
        {summits.isLoading ? (
          <Text style={[styles.message, { color: muted }]}>Loading your trail…</Text>
        ) : summits.error ? (
          <Text style={[styles.message, { color: muted }]} onPress={() => void summits.retry()}>
            {getErrorMessage(summits.error, "Could not load summits. Tap to try again.")}
          </Text>
        ) : summits.sessions.length === 0 ? (
          <Text style={[styles.message, { color: muted }]}>
            No summits yet. Create one in the Climb tab.
          </Text>
        ) : (
          <SummitTaskList levels={summits.climb?.levels ?? []} ink={ink} muted={muted} />
        )}
      </FrostedPanel>
    </ImageBackground>
    </View>
  );
}

function FrostedPanel({
  source,
  night,
  frame,
  bottomInset,
  children,
}: {
  source: number;
  night: boolean;
  frame: { width: number; height: number };
  bottomInset: number;
  children: ReactNode;
}) {
  const [top, setTop] = useState(0);

  return (
    <View
      style={[styles.panel, { marginBottom: bottomInset }]}
      onLayout={(event) => setTop(event.nativeEvent.layout.y)}
    >
      <Image
        source={source}
        blurRadius={28}
        resizeMode="cover"
        style={[styles.blurred, { width: frame.width, height: frame.height, top: -top }]}
      />
      <View style={[styles.tint, night ? styles.tintNight : styles.tintDay]} />
      <View style={styles.panelBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: 2,
  },
  greeting: {
    fontFamily: typography.bodyBold,
    fontSize: 32,
    letterSpacing: -0.6,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  date: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.92)",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gap: { height: spacing.md },
  panel: {
    overflow: "hidden",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  blurred: { position: "absolute", left: 0 },
  tint: { ...StyleSheet.absoluteFill },
  tintDay: { backgroundColor: "rgba(255, 255, 255, 0.28)" },
  tintNight: { backgroundColor: "rgba(8, 16, 36, 0.38)" },
  panelBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  panelTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 22,
    letterSpacing: -0.3,
  },
  message: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 112,
  },
});
