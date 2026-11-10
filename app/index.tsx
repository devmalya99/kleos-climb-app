import { Redirect } from "expo-router";

import { useAuth } from "@/features/auth";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

export default function Index() {
  const { hydrated, token, user, isAuthenticated } = useAuth();

  if (!hydrated || (token && !user)) {
    return <LoadingBlock label="Booting Kleos…" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
