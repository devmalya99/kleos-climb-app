import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "PaceMaker",
  slug: "pacemaker-mobile",
  owner: "debmalya99",
  version: "1.0.1",
  // Finished preview binary (Android build 1, 21 Oct 2026) is runtime 1.0.0.
  // Pin this so the next OTA still installs there. `version` is what Settings shows.
  runtimeVersion: "1.0.0",
  updates: {
    url: "https://u.expo.dev/5b3a79bb-d161-44a4-b1c4-7df3107e2a16",
  },
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "pacemaker",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.pacemaker.mobile",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0B1F17",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    package: "app.pacemaker.mobile",
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-font",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#0B1F17",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://kleos-ai.vercel.app",
    eas: {
      projectId: "5b3a79bb-d161-44a4-b1c4-7df3107e2a16",
    },
  },
});
