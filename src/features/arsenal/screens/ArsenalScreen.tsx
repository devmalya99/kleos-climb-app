import { StyleSheet, Text } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { isLockedError } from "@/shared/utils/isLockedError";

import { SkillCard } from "../components/SkillCard";
import { useArsenal } from "../hooks/useArsenal";

export function ArsenalScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const query = useArsenal();

  if (query.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading your arsenal…" />
      </Screen>
    );
  }

  if (isLockedError(query.error)) {
    return (
      <Screen>
        <ScreenHeader title="Arsenal" />
        <EmptyState
          title="Arsenal is locked"
          body="Earn your first skill XP from a quest or the Colosseum to unlock it."
        />
      </Screen>
    );
  }

  if (query.error || !query.data) {
    return (
      <Screen>
        <ScreenHeader title="Arsenal" />
        <EmptyState
          title="Couldn't load Arsenal"
          body={getErrorMessage(query.error)}
          actionLabel="Try again"
          onAction={() => void query.refetch()}
        />
      </Screen>
    );
  }

  const { skills, totalSkills, totalXp, highestRank } = query.data;

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      refreshing={query.isRefetching}
      onRefresh={() => void query.refetch()}
    >
      <ScreenHeader
        title="Arsenal"
        subtitle={`${totalSkills} ${totalSkills === 1 ? "skill" : "skills"} · ${totalXp.toLocaleString()} XP${
          highestRank ? ` · Highest: ${highestRank}` : ""
        }`}
      />
      {skills.length === 0 ? (
        <EmptyState
          title="No skills yet"
          body="Claim quests and fight in the Colosseum to grow your skills."
        />
      ) : (
        skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
      )}
      <Text style={styles.footnote}>Ranks and thresholds are calculated by the server.</Text>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  footnote: { fontFamily: typography.body, fontSize: 12, color: colors.inkSubtle },
});
}
