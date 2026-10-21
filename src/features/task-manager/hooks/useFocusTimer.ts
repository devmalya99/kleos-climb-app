import { useEffect } from "react";

import { useFocusTimerStore } from "../store/focusTimer.store";

/**
 * Drives the client-only focus timer. The interval runs only while the timer
 * is running, and unmounting (closing the sheet) always stops and resets it.
 */
export function useFocusTimer() {
  const timer = useFocusTimerStore();
  const { running, tick } = timer;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [running, tick]);

  useEffect(() => {
    return () => useFocusTimerStore.getState().reset();
  }, []);

  return timer;
}
