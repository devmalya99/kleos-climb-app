/** Stats strip shows once the user has an XP goal set. */
export function shouldShowStats(weekdayXp: number, weekendXp: number): boolean {
  return weekdayXp > 0 || weekendXp > 0;
}
