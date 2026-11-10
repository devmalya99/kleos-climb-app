import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTabBar } from "@/app/navigation/AppTabBar";
import { tabBarClearance } from "@/app/navigation/tabBar";
import { useTheme } from "@/app/theme";
import { useAuth } from "@/features/auth";
import { LoadingBlock } from "@/shared/components/LoadingBlock";

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { hydrated, token, user, isAuthenticated } = useAuth();
  const clearance = tabBarClearance(insets.bottom);

  if (!hydrated || (token && !user)) {
    return <LoadingBlock label="Booting Kleos…" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
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
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen
        name="taurus"
        options={{
          title: "Taurus",
          sceneStyle: { paddingBottom: 0, backgroundColor: "transparent" },
        }}
      />
      <Tabs.Screen name="notes" options={{ title: "Notes" }} />
      <Tabs.Screen name="control" options={{ title: "Control" }} />
    </Tabs>
  );
}
