import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth";
import { LoadingBlock } from "@/shared/components/LoadingBlock";
import { setSessionToken } from "@/services/storage/secure-session";
import { getMeApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function AuthCallbackRoute() {
  const params = useLocalSearchParams<{ token?: string; error?: string }>();
  const { refreshMe } = useAuth();
  const setSession = useAuthStore((s) => s.setSession);
  const [done, setDone] = useState<"ok" | "error" | null>(null);

  useEffect(() => {
    async function run() {
      if (params.error || !params.token) {
        setDone("error");
        return;
      }
      await setSessionToken(params.token);
      useAuthStore.setState({ token: params.token });
      const me = await getMeApi();
      setSession(me, params.token);
      await refreshMe();
      setDone("ok");
    }
    void run();
  }, [params.error, params.token, refreshMe, setSession]);

  if (done === "ok") return <Redirect href="/(tabs)" />;
  if (done === "error") return <Redirect href="/(auth)/login" />;
  return <LoadingBlock label="Finishing Google sign-in…" />;
}
