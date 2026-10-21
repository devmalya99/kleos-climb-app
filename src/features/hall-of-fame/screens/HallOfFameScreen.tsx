import { useState } from "react";
import { StyleSheet } from "react-native";

import { spacing } from "@/app/theme";
import {
  ANY_EXAM_ID,
  ProgressReportSheet,
  type PublicLevelBadge,
} from "@/features/level-analyser";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { ListRow } from "@/shared/components/ListRow";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { isLockedError } from "@/shared/utils/isLockedError";

import { useBadges } from "../hooks/useBadges";

export function HallOfFameScreen() {
  const query = useBadges();
  const [selected, setSelected] = useState<PublicLevelBadge | null>(null);

  if (query.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading your badges…" />
      </Screen>
    );
  }

  if (isLockedError(query.error)) {
    return (
      <Screen>
        <ScreenHeader title="Hall of Fame" />
        <EmptyState
          title="Hall of Fame is locked"
          body="Earn your first Level Analyser badge to unlock it."
        />
      </Screen>
    );
  }

  if (query.error || !query.data) {
    return (
      <Screen>
        <ScreenHeader title="Hall of Fame" />
        <EmptyState
          title="Couldn't load badges"
          body={getErrorMessage(query.error)}
          actionLabel="Try again"
          onAction={() => void query.refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshing={query.isRefetching}
      onRefresh={() => void query.refetch()}
    >
      <ScreenHeader
        title="Hall of Fame"
        subtitle={`${query.data.length} ${query.data.length === 1 ? "badge" : "badges"} earned`}
      />
      {query.data.length === 0 ? (
        <EmptyState
          title="No badges yet"
          body="Run the Level Analyser on a realm to earn a mastery badge."
        />
      ) : (
        query.data.map((badge) => (
          <ListRow
            key={badge.id}
            title={`${badge.realmName} · ${badge.tierLabel}`}
            subtitle={`${badge.campaignName} · ${new Date(badge.earnedAt).toLocaleDateString()}`}
            right={`${badge.score}/${badge.maxScore}`}
            onPress={() => setSelected(badge)}
          />
        ))
      )}
      {selected ? (
        <ProgressReportSheet
          examId={ANY_EXAM_ID}
          categoryId={selected.categoryId}
          title={`${selected.realmName} report`}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingBottom: spacing.xxl },
});
