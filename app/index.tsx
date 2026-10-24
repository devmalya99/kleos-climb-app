import { Redirect, type Href } from "expo-router";

import { needsOnboarding } from "@/app/navigation/signedInHref";
import { useAuth } from "@/features/auth";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

export default function Index() {
  const { hydrated, isAuthenticated, isLoadingMe, token, user } = useAuth();

  if (!hydrated || (token && isLoadingMe)) {
    return <LoadingBlock label="Booting PaceMaker…" />;
  }

  if (isAuthenticated) {
    return <Redirect href={(needsOnboarding(user) ? "/onboarding" : "/(tabs)") as Href} />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
