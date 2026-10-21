import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";
import { useAuth } from "@/features/auth";

import { climbChrome, type ClimbChrome } from "../utils/climb-chrome";

type SymbolName = Extract<ComponentProps<typeof SymbolView>["name"], object>;

function initials(email: string | undefined): string {
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "?";
}

export function ClimbBrand() {
  const { scheme } = useTheme();
  const { user } = useAuth();
  const night = scheme === "dark";
  const chrome = climbChrome(scheme);
  const styles = createStyles(chrome, night);

  return (
    <View style={styles.row}>
      <View style={styles.mark}>
        <SymbolView
          name={icon("mountain.2.fill", "landscape")}
          tintColor={night ? chrome.honey : chrome.honeyInk}
          size={18}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{night ? "Elevation ascent" : "Pacemaker"}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{night ? "Climb" : "Expeditions"}</Text>
          {night ? <View style={styles.live} /> : null}
        </View>
      </View>
      {night ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={() => router.push("/more/settings")}
          style={styles.avatar}
        >
          <SymbolView name={icon("bell.fill", "notifications")} tintColor={chrome.ink} size={18} />
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile"
          onPress={() => router.push("/more/profile")}
          style={styles.avatar}
        >
          <Text style={styles.initials}>{initials(user?.email)}</Text>
        </Pressable>
      )}
    </View>
  );
}

function icon(ios: NonNullable<SymbolName["ios"]>, android: NonNullable<SymbolName["android"]>) {
  return { ios, android, web: android } as const;
}

function createStyles(chrome: ClimbChrome, night: boolean) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    mark: {
      width: 40,
      height: 40,
      borderRadius: night ? 12 : 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: night ? "#2C2416" : chrome.honey,
    },
    copy: { flex: 1, gap: 1 },
    eyebrow: {
      fontFamily: typography.bodyMedium,
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: chrome.muted,
    },
    titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    title: {
      fontFamily: typography.bodyBold,
      fontSize: 28,
      letterSpacing: -0.4,
      color: chrome.ink,
    },
    live: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: chrome.positive,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.avatar,
    },
    initials: {
      fontFamily: typography.bodyBold,
      fontSize: 14,
      color: chrome.avatarInk,
    },
  });
}
