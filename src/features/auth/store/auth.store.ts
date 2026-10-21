import { create } from "zustand";

import type { PublicUser } from "../types/auth.types";

type AuthState = {
  user: PublicUser | null;
  token: string | null;
  hydrated: boolean;
  setSession: (user: PublicUser, token: string) => void;
  setUser: (user: PublicUser | null) => void;
  setHydrated: (hydrated: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  setSession: (user, token) => set({ user, token }),
  setUser: (user) => set({ user }),
  setHydrated: (hydrated) => set({ hydrated }),
  clear: () => set({ user: null, token: null }),
}));
