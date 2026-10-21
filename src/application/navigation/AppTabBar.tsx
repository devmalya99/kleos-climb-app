import { SymbolView } from "expo-symbols";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { typography, useTheme } from "@/app/theme";
import { PressableScale } from "@/shared/components/PressableScale";

import { TAB_BAR_HEIGHT, TAB_BAR_SIDE_INSET } from "./tabBar";

type SymbolName = Extract<ComponentProps<typeof SymbolView>["name"], object>;
type IconName = {
  ios: NonNullable<SymbolName["ios"]>;
  android: NonNullable<SymbolName["android"]>;
};

const ICONS: Record<string, IconName> = {
  index: { ios: "house.fill", android: "home" },
  climb: { ios: "mountain.2.fill", android: "landscape" },
  taurus: { ios: "bubble.left.fill", android: "chat" },
  clutter: { ios: "book.fill", android: "menu_book" },
  more: { ios: "person.fill", android: "person" },
};

type AppTabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: {
    emit: (event: { type: "tabPress"; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
  insets: { bottom: number };
};

export function AppTabBar({ state, descriptors, navigation, insets }: AppTabBarProps) {
  const { scheme } = useTheme();
  const night = scheme === "dark";
  const bar = night
    ? { background: "#141821", border: "#2A3142", inactive: "#8E95A5", active: "#F5A524", pill: "transparent" }
    : { background: "#FFFFFF", border: "#EFE8DE", inactive: "#9A938A", active: "#7A5209", pill: "#F8E7C0" };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: bar.background,
          borderColor: bar.border,
          bottom: Math.max(insets.bottom, 10),
        },
        night ? styles.barNight : styles.barDay,
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? bar.active : bar.inactive;
        const icon = ICONS[route.name] ?? ICONS.more;
        const label = descriptors[route.key]?.options.title ?? route.name;

        return (
          <PressableScale
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            pressedScale={0.92}
            containerStyle={styles.item}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }}
          >
            <View style={[styles.itemInner, focused && !night ? { backgroundColor: bar.pill } : null]}>
              <SymbolView
                name={{ ios: icon.ios, android: icon.android, web: icon.android }}
                tintColor={color}
                size={22}
              />
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {label}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: TAB_BAR_SIDE_INSET,
    right: TAB_BAR_SIDE_INSET,
    height: TAB_BAR_HEIGHT,
    borderRadius: 32,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    zIndex: 10,
  },
  barDay: {
    shadowColor: "#C4B6A4",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  barNight: {
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center" },
  itemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 56,
  },
  label: { fontFamily: typography.bodyMedium, fontSize: 11 },
});
