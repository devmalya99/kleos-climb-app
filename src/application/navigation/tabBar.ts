export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_SIDE_INSET = 16;
export const TAB_BAR_BOTTOM_GAP = 10;

/** Space a screen needs so its last content clears the floating tab bar. */
export function tabBarClearance(bottomInset: number): number {
  return TAB_BAR_HEIGHT + Math.max(bottomInset, TAB_BAR_BOTTOM_GAP) + 12;
}
