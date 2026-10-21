import { Redirect } from "expo-router";

import { useAuth } from "@/features/auth";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

export default function Index() {
  const { hydrated, isAuthenticated, isLoadingMe, token } = useAuth();

  if (!hydrated || (token && isLoadingMe)) {
    return <LoadingBlock label="Booting PaceMaker…" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
