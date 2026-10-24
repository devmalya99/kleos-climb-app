import { Redirect, Tabs, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTabBar } from "@/app/navigation/AppTabBar";
import { needsOnboarding } from "@/app/navigation/signedInHref";
import { tabBarClearance } from "@/app/navigation/tabBar";
import { useTheme } from "@/app/theme";
import { useAuth } from "@/features/auth";
import { climbChrome } from "@/features/mountain-climber";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

export default function TabLayout() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { hydrated, token, user, isAuthenticated } = useAuth();
  const clearance = tabBarClearance(insets.bottom);
  const climbPage = climbChrome(scheme).page;

  if (!hydrated || (token && !user)) {
    return <LoadingBlock label="Booting PaceMaker…" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (needsOnboarding(user)) {
    return <Redirect href={"/onboarding" as Href} />;
  }

  return (
    <Tabs
      tabBar={(props) => (
        <AppTabBar
          state={props.state}
          descriptors={props.descriptors}
          insets={props.insets}
          navigation={props.navigation}
        />
      )}
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,
        animation: "fade",
        sceneStyle: { paddingBottom: clearance, backgroundColor: colors.surface },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          sceneStyle: { paddingBottom: 0, backgroundColor: "transparent" },
        }}
      />
      <Tabs.Screen
        name="climb"
        options={{
          title: "Climb",
          sceneStyle: { paddingBottom: clearance, backgroundColor: climbPage },
        }}
      />
      <Tabs.Screen
        name="taurus"
        options={{
          title: "Taurus",
          sceneStyle: { paddingBottom: 0, backgroundColor: "transparent" },
        }}
      />
      <Tabs.Screen name="clutter" options={{ title: "Clutter" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}
