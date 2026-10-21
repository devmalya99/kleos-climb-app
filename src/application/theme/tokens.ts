const shared = {
  /** Text and icons on solid danger fills. Stays white in both modes. */
  onFill: "#FFFFFF",
} as const;

/**
 * Light mode is warm paper with pastel surfaces.
 * `accent` is for text, icons, and borders — dark enough to read on paper.
 * `accentFill` is the solid honey used on buttons and bars, with `accentInk` on top.
 */
export const lightColors = {
  ...shared,
  bg: "#F7F4EF",
  bgElevated: "#EFE6D8",
  bgMuted: "#E6DCCE",
  surface: "#F7F4EF",
  surfaceCard: "#FFFFFF",
  ink: "#1C1917",
  inkMuted: "#6B6158",
  inkSubtle: "#94897E",
  accent: "#7A5209",
  accentFill: "#E6B325",
  accentInk: "#1C1408",
  accentSoft: "#F8E7C0",
  warning: "#A15C07",
  success: "#1F7A56",
  danger: "#C94545",
  border: "#E4D9C8",
  borderStrong: "#CDBFA8",
  overlay: "rgba(28, 25, 23, 0.55)",
} as const;

/**
 * Dark mode is a matte charcoal shell.
 * Accent is a cool periwinkle so controls stay visible on near-black surfaces.
 */
export const darkColors = {
  ...shared,
  bg: "#0C0C0F",
  bgElevated: "#18181E",
  bgMuted: "#22222A",
  surface: "#101014",
  surfaceCard: "#1A1A22",
  ink: "#F4F4F6",
  inkMuted: "#B0B0BA",
  inkSubtle: "#7E7E8A",
  accent: "#AFC0FF",
  accentFill: "#4461F2",
  accentInk: "#FFFFFF",
  accentSoft: "#232838",
  warning: "#F0B429",
  success: "#3DDC97",
  danger: "#FF6B6B",
  border: "#2C2C36",
  borderStrong: "#45455A",
  overlay: "rgba(0, 0, 0, 0.72)",
} as const;

export type AppColors = { [Key in keyof typeof lightColors]: string };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: "BebasNeue_400Regular",
  body: "DMSans_400Regular",
  bodyItalic: "DMSans_400Regular_Italic",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
} as const;

export const theme = {
  spacing,
  radius,
  typography,
} as const;
