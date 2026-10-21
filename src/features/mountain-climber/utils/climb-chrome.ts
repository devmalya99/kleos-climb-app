import { SUMMIT_ALTITUDE_METERS } from "../constants/climb.constants";

export type ClimbChrome = {
  page: string;
  card: string;
  cardBorder: string;
  ink: string;
  muted: string;
  honey: string;
  honeyInk: string;
  stat: string;
  lineAhead: string;
  lineWalked: string;
  nodeIdle: string;
  nodeIdleBorder: string;
  nodeIdleInk: string;
  activeBorder: string;
  activeWash: string;
  badge: string;
  badgeInk: string;
  locked: string;
  lockedInk: string;
  track: string;
  positive: string;
  outline: string;
  avatar: string;
  avatarInk: string;
  iconButton: string;
};

/** Screen colors for the ascent layout. Separate from the app accent so both themes match the climb mock. */
export function climbChrome(scheme: "light" | "dark"): ClimbChrome {
  if (scheme === "dark") {
    return {
      page: "#07080D",
      card: "#10131C",
      cardBorder: "#232838",
      ink: "#F4F6FB",
      muted: "#9AA3B5",
      honey: "#F5A524",
      honeyInk: "#1A1204",
      stat: "#161A24",
      lineAhead: "#3EC6FF",
      lineWalked: "#3DDC97",
      nodeIdle: "#12151E",
      nodeIdleBorder: "#3A4154",
      nodeIdleInk: "#F4F6FB",
      activeBorder: "#F5A524",
      activeWash: "#141820",
      badge: "#1C2433",
      badgeInk: "#7DD3FC",
      locked: "#1C2230",
      lockedInk: "#9AA3B5",
      track: "#2A3142",
      positive: "#3DDC97",
      outline: "#3A4154",
      avatar: "#1C2230",
      avatarInk: "#F4F6FB",
      iconButton: "#1A1E2A",
    };
  }

  return {
    page: "#F6F3EE",
    card: "#FFFFFF",
    cardBorder: "#EFE8DE",
    ink: "#1C1917",
    muted: "#8A8178",
    honey: "#F0B429",
    honeyInk: "#1C1408",
    stat: "#F7F4EF",
    lineAhead: "#F0B429",
    lineWalked: "#7DBE4A",
    nodeIdle: "#FFFFFF",
    nodeIdleBorder: "#E4D9C8",
    nodeIdleInk: "#1C1917",
    activeBorder: "#F0C14A",
    activeWash: "#FFFCF6",
    badge: "#FFF6DE",
    badgeInk: "#A15C07",
    locked: "#F1EEE9",
    lockedInk: "#8A8178",
    track: "#F3E6C8",
    positive: "#1F7A56",
    outline: "#E4D9C8",
    avatar: "#F6D2B0",
    avatarInk: "#6B3E12",
    iconButton: "#FFFFFF",
  };
}

/** Evenly spaced camp altitudes. Index 0 is the lowest camp. */
export function campAltitudeMeters(index: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round(((index + 1) / total) * SUMMIT_ALTITUDE_METERS);
}

export function summitKilometersLabel(): string {
  return `${(SUMMIT_ALTITUDE_METERS / 1000).toFixed(1)} km`;
}

export function formatMeters(meters: number): string {
  return meters.toLocaleString();
}

export function formatClimbDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function windowDaysLabel(daysLeft: number): string {
  if (daysLeft > 1) return `${daysLeft} days`;
  if (daysLeft === 1) return "1 day";
  if (daysLeft === 0) return "Today";
  return `${Math.abs(daysLeft)} overdue`;
}
