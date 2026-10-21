import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { QuestEditorSheet, QuestRow } from "@/features/quests";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";

import { RealmActions } from "../components/RealmActions";
import { useRealmDetail } from "../hooks/useRealmDetail";

type RealmDetailScreenProps = {
  examId: string;
  categoryId: string;
};

export function RealmDetailScreen({ examId, categoryId }: RealmDetailScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const detail = useRealmDetail(examId, categoryId);
  const { realm, quests } = detail;

  if (detail.isLoading) {
    return (
      <Screen>
        <LoadingBlock label="Loading realm…" />
      </Screen>
    );
  }

  if (detail.loadError || !realm) {
    return (
      <Screen>
        <ScreenHeader title="Realm" />
        <EmptyState
          title="Realm unavailable"
          body={
            detail.loadError
              ? getErrorMessage(detail.loadError, "Could not load this realm.")
              : "This realm no longer exists."
          }
          actionLabel="Try again"
          onAction={detail.retry}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader
        title={realm.name}
        subtitle={`${quests.length} ${quests.length === 1 ? "quest" : "quests"}`}
      />
      <RealmActions
        analyse={detail.analyse}
        onAnalyse={detail.openAnalyser}
        onColosseum={detail.openColosseum}
        onAutofill={detail.openAutofill}
      />

      <View style={styles.sectionHead}>
        <Text style={styles.section}>Quests</Text>
        <Button label="Add quest" variant="secondary" onPress={() => detail.openEditor(null)} />
      </View>

      {detail.error && !detail.editorOpen ? (
        <Text style={styles.error}>{detail.error}</Text>
      ) : null}

      {quests.length === 0 ? (
        <EmptyState
          title="No quests yet"
          body="Add your first quest, or use Autofill to draft them from your notes."
        />
      ) : (
        quests.map((quest, index) => (
          <QuestRow
            key={quest.id}
            quest={quest}
            canMoveUp={index > 0}
            canMoveDown={index < quests.length - 1}
            onClaim={() => detail.claimQuest(quest)}
            onEdit={() => detail.openEditor(quest)}
            onDelete={() => detail.deleteQuest(quest)}
            onMoveUp={() => void detail.moveQuest(index, "up")}
            onMoveDown={() => void detail.moveQuest(index, "down")}
          />
        ))
      )}

      <Button label="Delete realm" variant="danger" onPress={detail.deleteRealm} />

      {detail.editorOpen ? (
        <QuestEditorSheet
          quest={detail.editing}
          saving={detail.isSaving}
          error={detail.error}
          onClose={detail.closeEditor}
          onSubmit={(values) => void detail.saveQuest(values)}
        />
      ) : null}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionHead: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  section: {
    fontFamily: typography.bodyBold,
    fontSize: 18,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  error: {
    fontFamily: typography.bodyMedium,
    color: colors.danger,
  },
});
}
