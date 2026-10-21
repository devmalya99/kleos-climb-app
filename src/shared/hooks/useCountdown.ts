import { useEffect, useRef, useState } from "react";

/**
 * Counts down from `totalSeconds` and calls `onExpire` once at zero.
 * Pass `null` to disable. Change `resetKey` to restart (e.g. per question).
 */
export function useCountdown(
  totalSeconds: number | null,
  resetKey: string,
  onExpire: () => void,
): number | null {
  const [remaining, setRemaining] = useState<number | null>(totalSeconds);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (totalSeconds === null) {
      setRemaining(null);
      return;
    }
    const endsAt = Date.now() + totalSeconds * 1000;
    setRemaining(totalSeconds);
    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(interval);
        expireRef.current();
      }
    }, 250);
    return () => clearInterval(interval);
  }, [totalSeconds, resetKey]);

  return remaining;
}

export function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
