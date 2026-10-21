import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { ListRow } from "@/shared/components/ListRow";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

import { CLUTTER_HONEY, clutterHref, type ClutterHoney } from "../constants/brainClutter.constants";
import { useClutterWorkspace } from "../hooks/useClutterWorkspace";
import type { ClutterGroup } from "../types/brainClutter.types";

import { GroupCard } from "./GroupCard";
import { GroupNameSheet } from "./GroupNameSheet";

/** Notes mode of the Clutter tab: bucket list, stats and pending note-tasks. */
export function GroupsPanel() {
  const { colors, scheme } = useTheme();
  const honey = CLUTTER_HONEY[scheme];
  const styles = createStyles(colors, honey, scheme === "dark");

  const workspace = useClutterWorkspace();
  // `null` = closed, `"new"` = create, otherwise the bucket being renamed.
  const [sheet, setSheet] = useState<ClutterGroup | "new" | null>(null);

  if (workspace.isLoading) return <LoadingBlock label="Loading buckets…" />;

  if (workspace.loadError) {
    return (
      <EmptyState
        title="Buckets unavailable"
        body={getErrorMessage(workspace.loadError, "Could not load your buckets.")}
        actionLabel="Try again"
        onAction={() => void workspace.refetch()}
      />
    );
  }

  async function handleSubmit(name: string) {
    const result =
      sheet === "new"
        ? await workspace.createGroup(name)
        : sheet
          ? await workspace.renameGroup(sheet.id, name)
          : null;
    if (result?.ok) setSheet(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {workspace.stats ? (
        <Text style={styles.stats}>
          {workspace.stats.bucketCount} buckets · {workspace.stats.noteCount} notes ·{" "}
          {workspace.stats.storagePercent}% of storage
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          workspace.clearError();
          setSheet("new");
        }}
        style={({ pressed }) => [styles.create, pressed ? styles.createPressed : null]}
      >
        <Text style={styles.createLabel}>New bucket</Text>
      </Pressable>
      {workspace.error && !sheet ? <Text style={styles.error}>{workspace.error}</Text> : null}

      {workspace.groups.length === 0 ? (
        <EmptyState
          title="No buckets yet"
          body="Buckets group your notes. Create one to start capturing ideas."
        />
      ) : (
        <View style={styles.list}>
          {workspace.groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onOpen={() => router.push(clutterHref.group(group.id))}
              onTogglePin={() => void workspace.togglePin(group)}
              onRename={() => {
                workspace.clearError();
                setSheet(group);
              }}
              onDelete={() => workspace.deleteGroup(group)}
            />
          ))}
        </View>
      )}

      {workspace.pendingTasks.length > 0 ? (
        <View style={styles.list}>
          <Text style={styles.section}>Pending note tasks</Text>
          {workspace.pendingTasks.map((task) => (
            <ListRow key={task.id} title={task.title} meta={task.groupName} />
          ))}
        </View>
      ) : null}

      {sheet ? (
        <GroupNameSheet
          initialName={sheet === "new" ? null : sheet.name}
          saving={workspace.isSaving}
          error={workspace.error}
          onClose={() => setSheet(null)}
          onSubmit={(name) => void handleSubmit(name)}
        />
      ) : null}
    </ScrollView>
  );
}

function createStyles(colors: AppColors, honey: ClutterHoney, night: boolean) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  stats: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.inkSubtle },
  create: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: honey.fill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    shadowColor: night ? honey.fill : "transparent",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: night ? 0.35 : 0,
    shadowRadius: 16,
    elevation: night ? 6 : 0,
  },
  createPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  createLabel: { fontFamily: typography.bodyBold, fontSize: 16, color: honey.ink },
  list: { gap: spacing.md },
  section: {
    fontFamily: typography.bodyBold,
    fontSize: 18,
    letterSpacing: -0.2,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
});
}
