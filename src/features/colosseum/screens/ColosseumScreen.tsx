import { Stack } from "expo-router";
import { useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";

import { spacing } from "@/app/theme";
import { useRealms } from "@/features/realms";
import { getErrorMessage } from "@/services/api";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { UnlockOverlay } from "@/shared/components/UnlockOverlay";
import { confirmAction } from "@/shared/utils/confirmAction";

import { ColosseumArena } from "../components/ColosseumArena";
import { ColosseumResult } from "../components/ColosseumResult";
import { ColosseumRules } from "../components/ColosseumRules";
import { useColosseum } from "../hooks/useColosseum";

type ColosseumScreenProps = {
  examId: string;
  categoryId: string;
};

export function ColosseumScreen({ examId, categoryId }: ColosseumScreenProps) {
  const colosseum = useColosseum(examId, categoryId);
  const realmsQuery = useRealms(examId);
  const realmName = realmsQuery.data?.find((realm) => realm.id === categoryId)?.name ?? "Realm";
  const { run, surrender } = colosseum;

  // Android hardware back during a run asks to surrender instead of silently abandoning it.
  useEffect(() => {
    if (!run) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmAction(
        {
          title: "Surrender run?",
          message: "Leaving ends the run and still counts toward today's limit.",
          confirmLabel: "Surrender",
        },
        () => void surrender(),
      );
      return true;
    });
    return () => subscription.remove();
  }, [run, surrender]);

  if (run) {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <ColosseumArena
          key={run.question.id}
          run={run}
          pendingWrong={colosseum.pendingWrong}
          busy={colosseum.isBusy}
          error={colosseum.error}
          onAnswer={(index) => void colosseum.answer(index)}
          onTimeout={() => void colosseum.timeout()}
          onContinue={colosseum.continueAfterWrong}
          onSurrender={() => void colosseum.surrender()}
        />
      </>
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Colosseum" subtitle={realmName} />

      {colosseum.isLoadingStatus ? <LoadingBlock label="Checking the arena…" /> : null}

      {colosseum.statusError && !colosseum.isLoadingStatus ? (
        <EmptyState
          title="Arena unavailable"
          body={getErrorMessage(colosseum.statusError, "Could not load the Colosseum.")}
          actionLabel="Try again"
          onAction={colosseum.retryStatus}
        />
      ) : null}

      {colosseum.status ? (
        <ColosseumRules
          status={colosseum.status}
          starting={colosseum.isBusy}
          error={colosseum.error}
          onStart={() => void colosseum.start()}
          onBack={colosseum.leave}
        />
      ) : null}

      <ColosseumResult
        visible={Boolean(colosseum.ended) && !colosseum.currentUnlock}
        result={colosseum.ended}
        canRunAgain={Boolean(colosseum.status?.canStart)}
        onRunAgain={() => void colosseum.start()}
        onClose={colosseum.leave}
      />
      <UnlockOverlay kind={colosseum.currentUnlock} onDismiss={colosseum.dismissUnlock} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
});
