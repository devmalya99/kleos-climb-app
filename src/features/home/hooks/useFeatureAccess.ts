import { router, type Href } from "expo-router";
import { Alert } from "react-native";

import type { FeatureUnlocks } from "@/features/auth";

import type { FeatureItem } from "../constants/home.constants";

/** Soft-lock behaviour shared by Home tiles and the More tab. Unlocks are server truth. */
export function useFeatureAccess(unlocks: FeatureUnlocks | undefined) {
  function isLocked(item: FeatureItem): boolean {
    return item.unlockKey ? !unlocks?.[item.unlockKey] : false;
  }

  function open(item: FeatureItem) {
    if (isLocked(item)) {
      Alert.alert(`${item.title} is locked`, item.lockedHint ?? "Keep studying to unlock this.");
      return;
    }
    router.push(item.href as Href);
  }

  return { isLocked, open };
}
