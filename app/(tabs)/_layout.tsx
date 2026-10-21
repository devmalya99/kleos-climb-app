import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTabBar } from "@/app/navigation/AppTabBar";
import { tabBarClearance } from "@/app/navigation/tabBar";
import { useTheme } from "@/app/theme";
import { climbChrome } from "@/features/mountain-climber";

export default function TabLayout() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const clearance = tabBarClearance(insets.bottom);
  const climbPage = climbChrome(scheme).page;

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
