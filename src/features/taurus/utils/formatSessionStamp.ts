export function taurusGreeting(now = new Date()): string {
  const hour = now.getHours();
  const when = hour < 12 ? "this morning" : hour < 17 ? "this afternoon" : "tonight";
  return `Hey! What are we working on ${when}?`;
}

/** "TONIGHT · 7:42 PM" for today, otherwise a short day label. */
export function formatSessionStamp(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const dayStart = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const dayDiff = Math.round((dayStart(now) - dayStart(date)) / 86_400_000);

  if (dayDiff === 0) {
    const hour = date.getHours();
    const label = hour < 12 ? "THIS MORNING" : hour < 17 ? "THIS AFTERNOON" : "TONIGHT";
    return `${label} · ${time}`;
  }
  if (dayDiff === 1) return `YESTERDAY · ${time}`;

  const day = date.toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase();
  return `${day} · ${time}`;
}

export function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
