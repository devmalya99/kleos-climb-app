import { useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";

import { AddLevelForm } from "../components/AddLevelForm";
import { ClimbBrand } from "../components/ClimbBrand";
import { ClimbHeader } from "../components/ClimbHeader";
import { ClimbReorderSheet } from "../components/ClimbReorderSheet";
import { GoalSetupWizard } from "../components/GoalSetupWizard";
import { TrailList } from "../components/TrailList";
import { useMountainClimb } from "../hooks/useMountainClimb";
import { climbChrome } from "../utils/climb-chrome";
import { getClimbStats } from "../utils/climb-path";

export function MountainClimberScreen() {
  const { scheme } = useTheme();
  const chrome = climbChrome(scheme);
  const styles = createStyles(chrome.page);
  const state = useMountainClimb();
  const [isCreating, setIsCreating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [trailDragging, setTrailDragging] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const cardNodes = useRef<Record<string, View>>({});
  const scrolledTo = useRef<string | null>(null);

  const climb = state.climb;
  const stats = climb ? getClimbStats(climb, new Date()) : null;
  const currentLevelId = climb && stats ? climb.levels[stats.currentLevelIndex]?.id : undefined;

  useEffect(() => {
    if (!climb || !currentLevelId) return;
    const token = `${climb.id}:${currentLevelId}`;
    if (scrolledTo.current === token) return;
    const card = cardNodes.current[currentLevelId];
    const content = contentRef.current;
    if (!card || !content) return;
    card.measureLayout(
      content,
      (_x, y) => {
        scrolledTo.current = token;
        scrollRef.current?.scrollTo({ y: Math.max(0, y - spacing.md), animated: true });
      },
      () => undefined,
    );
  }, [climb, currentLevelId]);

  if (state.isLoading) {
    return (
      <Screen style={styles.page} edges={["top"]}>
        <LoadingBlock label="Loading your climb…" />
      </Screen>
    );
  }

  if (state.loadError) {
    return (
      <Screen style={styles.page} edges={["top"]} scroll contentStyle={styles.content}>
        <ClimbBrand />
        <EmptyState
          title="Climb unavailable"
          body={getErrorMessage(state.loadError, "Could not load your climb.")}
          actionLabel="Try again"
          onAction={() => void state.retryLoad()}
        />
      </Screen>
    );
  }

  if (!climb || isCreating || !stats) {
    return (
      <Screen style={styles.page} edges={["top"]} scroll contentStyle={styles.content}>
        <ClimbBrand />
        <GoalSetupWizard
          onStart={(input) => {
            void state.startClimb(input).then((result) => {
              if (result.ok) setIsCreating(false);
            });
          }}
          onCancel={climb ? () => setIsCreating(false) : undefined}
          isSubmitting={state.isStarting}
        />
        {state.error ? <Text style={styles.error}>{state.error}</Text> : null}
      </Screen>
    );
  }

  return (
    <Screen style={styles.page} edges={["top"]} contentStyle={styles.fill}>
      <ScrollView
        ref={scrollRef}
        style={styles.fill}
        scrollEnabled={!trailDragging}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={() => void state.retryLoad()}
          />
        }
      >
        <View ref={contentRef} collapsable={false} style={styles.content}>
          <ClimbBrand />
          <ClimbHeader
            goal={climb.goal}
            deadline={climb.deadline}
            stats={stats}
            sessions={state.sessions}
            climbId={climb.id}
            onOpenSummit={state.openSummit}
            deleting={state.isDeleting}
            canAddTask={!stats.isSummitReached && !isAdding}
            onAddTask={() => setIsAdding(true)}
            onNewSummit={() => {
              if (state.requestNewSummit()) setIsCreating(true);
            }}
            canReorder={climb.levels.filter((level) => level.completedAt === null).length >= 2}
            onReorder={() => setReorderOpen(true)}
            onDelete={state.deleteSummit}
          />
          {state.error ? <Text style={styles.error}>{state.error}</Text> : null}
          {isAdding ? (
            <AddLevelForm
              onAdd={(title, description) => {
                void state.addTrailLevel(title, description);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          ) : null}
          <TrailList
            climb={climb}
            currentLevelIndex={stats.currentLevelIndex}
            onClear={() => void state.clearLevel()}
            onUndo={() => void state.undoClear()}
            onRemove={(levelId) => void state.removeLevel(levelId)}
            onEdit={(levelId, title, description) =>
              void state.editLevel(levelId, title, description)
            }
            onProgress={(levelId, progress) => void state.setLevelProgress(levelId, progress)}
            onMove={(activeId, overId) => void state.moveLevel(activeId, overId)}
            onDraggingChange={setTrailDragging}
            registerCard={(id, node) => {
              if (node) cardNodes.current[id] = node;
              else delete cardNodes.current[id];
            }}
          />
        </View>
      </ScrollView>
      {reorderOpen ? (
        <ClimbReorderSheet
          climb={climb}
          onApply={state.reorderLevels}
          onClose={() => setReorderOpen(false)}
        />
      ) : null}
    </Screen>
  );
}

function createStyles(page: string) {
  return StyleSheet.create({
    page: { backgroundColor: page },
    fill: { flex: 1, paddingHorizontal: 0, paddingVertical: 0 },
    content: { gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.lg },
    error: { fontFamily: typography.bodyMedium, color: "#E15B64" },
  });
}
