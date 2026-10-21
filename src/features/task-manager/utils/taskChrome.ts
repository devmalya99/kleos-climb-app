import type { ResolvedScheme } from "@/app/theme";
import type { ComponentProps } from "react";
import { SymbolView } from "expo-symbols";

type SymbolName = Extract<ComponentProps<typeof SymbolView>["name"], object>;

export type TaskChrome = {
  page: string;
  card: string;
  cardBorder: string;
  ink: string;
  muted: string;
  honey: string;
  honeyInk: string;
  honeySoft: string;
  danger: string;
  dangerSoft: string;
  notesBg: string;
  notesInk: string;
  outline: string;
  iconWell: string;
  focus: string;
  focusInk: string;
};

/** Screen colors for the Tasks layout. Separate from the app accent so both themes match the mock. */
export function taskChrome(scheme: ResolvedScheme): TaskChrome {
  if (scheme === "dark") {
    return {
      page: "#101014",
      card: "#171A22",
      cardBorder: "#2A3142",
      ink: "#F4F6FB",
      muted: "#9AA3B5",
      honey: "#F5A524",
      honeyInk: "#1A1204",
      honeySoft: "#2A2416",
      danger: "#FF6B6B",
      dangerSoft: "#2A1717",
      notesBg: "#12151C",
      notesInk: "#E4C9D1",
      outline: "#3A4154",
      iconWell: "#1C2230",
      focus: "#E15B64",
      focusInk: "#FFF7F7",
    };
  }

  return {
    page: "#F7F4EF",
    card: "#FFFFFF",
    cardBorder: "#EFE8DE",
    ink: "#1C1917",
    muted: "#8A8178",
    honey: "#F0B429",
    honeyInk: "#1C1408",
    honeySoft: "#FFF6DE",
    danger: "#C94545",
    dangerSoft: "#FDECEC",
    notesBg: "#F8F1E7",
    notesInk: "#8C4A3C",
    outline: "#E4D9C8",
    iconWell: "#F7F1E6",
    focus: "#F0B429",
    focusInk: "#1C1408",
  };
}

export function taskIcon(
  ios: NonNullable<SymbolName["ios"]>,
  android: NonNullable<SymbolName["android"]>,
) {
  return { ios, android, web: android } as const;
}
