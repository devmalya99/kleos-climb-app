import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/app/theme";
import { useAuth } from "@/features/auth";
import { setUnauthorizedHandler } from "@/services/api";
import { restoreQueryCache, watchQueryCache } from "@/services/storage/query-cache";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 12 * 60 * 60 * 1000,
      retry: 1,
      refetchOnReconnect: true,
    },
  },
});

function AuthBootstrap({ children }: { children: ReactNode }) {
  const { hydrate, hydrated, logout } = useAuth();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await logout();
      router.replace("/(auth)/welcome");
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  if (!hydrated) {
    return null;
  }

  return children;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [cacheReady, setCacheReady] = useState(false);

  useEffect(() => {
    let stop = () => {};
    let cancelled = false;
    void restoreQueryCache(queryClient).finally(() => {
      if (cancelled) return;
      stop = watchQueryCache(queryClient);
      setCacheReady(true);
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded && cacheReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [cacheReady, fontsLoaded]);

  if (!fontsLoaded || !cacheReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthBootstrap>{children}</AuthBootstrap>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
