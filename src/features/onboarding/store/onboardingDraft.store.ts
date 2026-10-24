import { create } from "zustand";

export type OnboardingStep = "name" | "expedition" | "task";

type OnboardingDraft = {
  step: OnboardingStep;
  displayName: string;
  goal: string;
  deadline: string;
  taskTitle: string;
  setDraft: (patch: Partial<Omit<OnboardingDraft, "setDraft" | "clear">>) => void;
  clear: () => void;
};

const empty = {
  step: "name" as const,
  displayName: "",
  goal: "",
  deadline: "",
  taskTitle: "",
};

/** This app process only. A half-finished expedition is not written to disk or the server. */
export const useOnboardingDraftStore = create<OnboardingDraft>((set) => ({
  ...empty,
  setDraft: (patch) => set(patch),
  clear: () => set(empty),
}));
