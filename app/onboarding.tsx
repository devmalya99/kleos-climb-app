import { Redirect } from "expo-router";

import { needsOnboarding } from "@/app/navigation/signedInHref";
import { useAuth } from "@/features/auth";
import { OnboardingScreen } from "@/features/onboarding";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

export default function OnboardingRoute() {
  const { hydrated, isAuthenticated, isLoadingMe, token, user } = useAuth();

  if (!hydrated || (token && isLoadingMe && !user)) {
    return <LoadingBlock label="Booting PaceMaker…" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!needsOnboarding(user)) {
    return <Redirect href="/(tabs)" />;
  }

  return <OnboardingScreen />;
}
