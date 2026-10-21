import { router } from "expo-router";

import { EmptyState } from "@/shared/components/EmptyState";
import { Screen } from "@/shared/components/Screen";

export default function NotFoundScreen() {
  return (
    <Screen>
      <EmptyState
        title="Off the map"
        body="This screen doesn't exist (yet)."
        actionLabel="Go home"
        onAction={() => router.replace("/(tabs)")}
      />
    </Screen>
  );
}
