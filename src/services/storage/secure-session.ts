import * as SecureStore from "expo-secure-store";

import { logger } from "@/services/logging/logger";

const TOKEN_KEY = "pacemaker.auth.token";

export async function getSessionToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    logger.error("Failed to read session token", error);
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    logger.error("Failed to clear session token", error);
  }
}
