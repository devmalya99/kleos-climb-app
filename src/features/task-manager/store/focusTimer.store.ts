import { create } from "zustand";

import {
  TIMER_DEFAULT_MINUTES,
  TIMER_MAX_MINUTES,
  TIMER_MIN_MINUTES,
} from "../constants/taskManager.constants";

type FocusTimerState = {
  durationMinutes: number;
  remainingSeconds: number;
  running: boolean;
  /** Wall-clock end time while running, so backgrounding the app does not drift. */
  endsAt: number | null;
  setDuration: (minutes: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
};

function clampMinutes(minutes: number): number {
  return Math.min(TIMER_MAX_MINUTES, Math.max(TIMER_MIN_MINUTES, Math.round(minutes)));
}

function secondsLeft(endsAt: number): number {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
}

/** Client-only focus timer (1–180 min). Never synced to the server. */
export const useFocusTimerStore = create<FocusTimerState>((set, get) => ({
  durationMinutes: TIMER_DEFAULT_MINUTES,
  remainingSeconds: TIMER_DEFAULT_MINUTES * 60,
  running: false,
  endsAt: null,

  setDuration: (minutes) => {
    if (get().running) return;
    const next = clampMinutes(minutes);
    set({ durationMinutes: next, remainingSeconds: next * 60 });
  },

  start: () => {
    const { running, remainingSeconds, durationMinutes } = get();
    if (running) return;
    const seconds = remainingSeconds > 0 ? remainingSeconds : durationMinutes * 60;
    set({ running: true, remainingSeconds: seconds, endsAt: Date.now() + seconds * 1000 });
  },

  pause: () => {
    const { running, endsAt } = get();
    if (!running || endsAt === null) return;
    set({ running: false, endsAt: null, remainingSeconds: secondsLeft(endsAt) });
  },

  reset: () =>
    set((state) => ({
      running: false,
      endsAt: null,
      remainingSeconds: state.durationMinutes * 60,
    })),

  tick: () => {
    const { running, endsAt } = get();
    if (!running || endsAt === null) return;
    const left = secondsLeft(endsAt);
    if (left === 0) {
      set({ running: false, endsAt: null, remainingSeconds: 0 });
      return;
    }
    set({ remainingSeconds: left });
  },
}));
