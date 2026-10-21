/** Human message for a server-provided `retryAt` ISO timestamp. */
export function formatRetryAt(retryAt: string | undefined | null): string | null {
  if (!retryAt) return null;
  const time = new Date(retryAt);
  if (Number.isNaN(time.getTime())) return null;
  if (time.getTime() <= Date.now()) return "You can try again now.";
  return `You can try again at ${time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;
}
