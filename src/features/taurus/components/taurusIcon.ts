import type { ComponentProps } from "react";
import { SymbolView } from "expo-symbols";

type SymbolName = Extract<ComponentProps<typeof SymbolView>["name"], object>;

export function taurusIcon(
  ios: NonNullable<SymbolName["ios"]>,
  android: NonNullable<SymbolName["android"]>,
) {
  return { ios, android, web: android } as const;
}
