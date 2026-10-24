import { Redirect, Stack, useSegments, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { needsOnboarding } from "@/app/navigation/signedInHref";
import { AppProviders } from "@/app/providers/AppProviders";
import { useTheme } from "@/app/theme";
import { useAuth } from "@/features/auth";

function RootNavigator() {
  const { colors, scheme } = useTheme();
  const segments = useSegments();
  const { isAuthenticated, user } = useAuth();
  const top: string | undefined = segments[0];
  const publicRoute = top === "(auth)" || top === "auth" || top === "onboarding" || top === "index" || top === undefined;

  if (isAuthenticated && needsOnboarding(user) && !publicRoute) {
    return <Redirect href={"/onboarding" as Href} />;
  }

  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 320,
          contentStyle: { backgroundColor: colors.surface },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="more/settings" />
        <Stack.Screen name="more/profile" />
        <Stack.Screen name="auth/callback" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
