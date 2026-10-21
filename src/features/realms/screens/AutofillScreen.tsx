import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ListRow } from "@/shared/components/ListRow";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TextField } from "@/shared/components/TextField";

import { useRealmAutofill } from "../hooks/useRealmAutofill";

type AutofillScreenProps = {
  examId: string;
  categoryId: string;
};

export function AutofillScreen({ examId, categoryId }: AutofillScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const flow = useRealmAutofill(examId, categoryId);

  if (flow.isLoadingRealm) {
    return (
      <Screen>
        <LoadingBlock label="Loading realm…" />
      </Screen>
    );
  }

  if (!flow.realm) {
    return (
      <Screen>
        <ScreenHeader title="Autofill" />
        <EmptyState title="Realm not found" body="This realm no longer exists." />
      </Screen>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Autofill" subtitle={`Draft quests for ${flow.realm.name}`} />

      {flow.preview ? (
        <>
          {flow.message ? <Text style={styles.message}>{flow.message}</Text> : null}
          {flow.preview.map((topic, index) => (
            <ListRow
              key={`${topic.name}-${index}`}
              title={topic.name}
              subtitle={topic.description}
              meta={`${topic.priority} priority`}
            />
          ))}
          {flow.error ? <Text style={styles.error}>{flow.error}</Text> : null}
          <Button
            label={`Add ${flow.preview.length} quests`}
            onPress={() => void flow.onAccept()}
            loading={flow.isAccepting}
          />
          <Button label="Discard preview" variant="ghost" onPress={flow.discardPreview} />
        </>
      ) : (
        <View style={styles.form}>
          <TextField
            label="Notes or topics to cover"
            value={flow.notes}
            onChangeText={flow.setNotes}
            autoCapitalize="sentences"
            multiline
            placeholder="Paste syllabus lines, chapter names, or rough notes…"
            error={flow.error ?? undefined}
          />
          <Button
            label="Generate preview"
            onPress={() => void flow.onGenerate()}
            loading={flow.isGenerating}
          />
          <Text style={styles.hint}>
            Nothing is saved until you add the previewed quests.
          </Text>
        </View>
      )}
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  form: { gap: spacing.md },
  message: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.inkMuted,
  },
  hint: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSubtle,
  },
  error: {
    fontFamily: typography.bodyMedium,
    color: colors.danger,
  },
});
}
