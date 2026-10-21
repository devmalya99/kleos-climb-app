import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import { clearPersistedQueryCache } from "@/services/storage/query-cache";
import {
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from "@/services/storage/secure-session";

import {
  getGoogleAuthUrl,
  getMeApi,
  loginApi,
  logoutApi,
  signupApi,
} from "../api/auth.api";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import type { PublicUser } from "../types/auth.types";
import type { LoginInput, SignupInput } from "../utils/auth.schemas";

WebBrowser.maybeCompleteAuthSession();

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, token, hydrated, setSession, setUser, setHydrated, clear } =
    useAuthStore();

  const meQuery = useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: getMeApi,
    enabled: hydrated && Boolean(token),
    retry: false,
  });

  const applySession = useCallback(
    async (nextUser: PublicUser, nextToken: string) => {
      await setSessionToken(nextToken);
      setSession(nextUser, nextToken);
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, nextUser);
    },
    [queryClient, setSession],
  );

  const hydrate = useCallback(async () => {
    try {
      const stored = await getSessionToken();
      if (!stored) {
        clear();
        setHydrated(true);
        return;
      }
      useAuthStore.setState({ token: stored });
      const me = await getMeApi();
      setSession(me, stored);
      queryClient.setQueryData(AUTH_QUERY_KEYS.me, me);
    } catch (error) {
      logger.warn("Session hydrate failed", error);
      await clearSessionToken();
      clear();
    } finally {
      setHydrated(true);
    }
  }, [clear, queryClient, setHydrated, setSession]);

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => loginApi(input),
    onSuccess: async (data) => {
      await applySession(data.user, data.token);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (input: SignupInput) => signupApi(input),
    onSuccess: async (data) => {
      await applySession(data.user, data.token);
    },
  });

  const logout = useCallback(async () => {
    await logoutApi();
    await clearSessionToken();
    await clearPersistedQueryCache();
    clear();
    queryClient.clear();
  }, [clear, queryClient]);

  const refreshMe = useCallback(async () => {
    const me = await getMeApi();
    setUser(me);
    queryClient.setQueryData(AUTH_QUERY_KEYS.me, me);
    return me;
  }, [queryClient, setUser]);

  const startGoogleAuth = useCallback(async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      getGoogleAuthUrl(),
      "pacemaker://auth/callback",
    );
    if (result.type !== "success" || !result.url) {
      return { ok: false as const, error: "Google sign-in was cancelled." };
    }
    const url = new URL(result.url);
    const nextToken = url.searchParams.get("token");
    const error = url.searchParams.get("error");
    if (error || !nextToken) {
      return {
        ok: false as const,
        error: error ?? "Google sign-in failed.",
      };
    }
    await setSessionToken(nextToken);
    useAuthStore.setState({ token: nextToken });
    const me = await getMeApi();
    await applySession(me, nextToken);
    return { ok: true as const };
  }, [applySession, setSession]);

  return {
    user: meQuery.data ?? (user?.id ? user : null),
    token,
    hydrated,
    isAuthenticated: Boolean(token) && Boolean(meQuery.data ?? user?.id),
    isLoadingMe: meQuery.isLoading,
    hydrate,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout,
    refreshMe,
    startGoogleAuth,
    loginError: loginMutation.error
      ? getErrorMessage(loginMutation.error)
      : null,
    signupError: signupMutation.error
      ? getErrorMessage(signupMutation.error)
      : null,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
  };
}
