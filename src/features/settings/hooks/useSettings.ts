import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { useAuth } from "@/features/auth";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";

import {
  getQuestPacingApi,
  updateAvailabilityApi,
  updateNotificationSpeechApi,
} from "../api/settings.api";
import { SETTINGS_QUERY_KEYS } from "../constants/settings.constants";
import { availabilityFormSchema, getDeviceTimeZone } from "../utils/availability.schemas";

/** Settings logic: availability form, speech mute, quest pacing. `me` stays the source of truth. */
export function useSettings() {
  const { user, refreshMe } = useAuth();

  const [weekdayXp, setWeekdayXp] = useState(String(user?.weekdayXpPerDay ?? ""));
  const [weekendXp, setWeekendXp] = useState(String(user?.weekendXpPerDay ?? ""));
  const [timezone, setTimezone] = useState(user?.timezone ?? getDeviceTimeZone());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const pacingQuery = useQuery({
    queryKey: SETTINGS_QUERY_KEYS.questPacing,
    queryFn: getQuestPacingApi,
  });

  const availability = useMutation({ mutationFn: updateAvailabilityApi });
  const speech = useMutation({ mutationFn: updateNotificationSpeechApi });

  async function saveAvailability() {
    setBanner(null);
    const parsed = availabilityFormSchema.safeParse({
      weekdayXpPerDay: weekdayXp,
      weekendXpPerDay: weekendXp,
      timezone,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0] ?? "form")] ??= issue.message;
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
    try {
      await availability.mutateAsync(parsed.data);
      await refreshMe();
      void pacingQuery.refetch();
      setBanner({ kind: "success", text: "Availability saved." });
    } catch (error) {
      logger.error("Save availability failed", { message: getErrorMessage(error) });
      setBanner({ kind: "error", text: getErrorMessage(error, "Could not save availability") });
    }
  }

  async function setSpeechMuted(muted: boolean) {
    setBanner(null);
    try {
      await speech.mutateAsync(muted);
      await refreshMe();
    } catch (error) {
      logger.error("Update notification speech failed", { message: getErrorMessage(error) });
      setBanner({ kind: "error", text: getErrorMessage(error, "Could not update speech setting") });
    }
  }

  return {
    user,
    weekdayXp,
    weekendXp,
    timezone,
    setWeekdayXp,
    setWeekendXp,
    setTimezone,
    applyDeviceTimezone: () => setTimezone(getDeviceTimeZone()),
    fieldErrors,
    banner,
    isSavingAvailability: availability.isPending,
    saveAvailability,
    speechMuted: user?.notificationSpeechMuted ?? false,
    isUpdatingSpeech: speech.isPending,
    setSpeechMuted,
    pacing: pacingQuery.data ?? null,
    isPacingLoading: pacingQuery.isLoading,
    pacingError: pacingQuery.error,
    retryPacing: () => void pacingQuery.refetch(),
  };
}
