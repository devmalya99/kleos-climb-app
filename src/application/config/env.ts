import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

export const ENV = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    extra?.apiBaseUrl ??
    "https://kleos-ai.vercel.app",
  authScheme: "pacemaker",
} as const;
