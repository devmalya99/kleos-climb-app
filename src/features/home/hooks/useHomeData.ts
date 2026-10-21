import { useAuth } from "@/features/auth";

/** Home reads the signed-in user (`GET /api/auth/me`). */
export function useHomeData() {
  const { user, refreshMe } = useAuth();

  return {
    user,
    retry: () => {
      void refreshMe();
    },
  };
}
