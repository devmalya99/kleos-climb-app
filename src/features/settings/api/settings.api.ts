import type { PublicUser } from "@/features/auth";
import { api } from "@/services/api";

import type {
  AvailabilityInput,
  UserQuestPacing,
  UserResponse,
} from "../types/settings.types";

export async function updateAvailabilityApi(input: AvailabilityInput): Promise<PublicUser> {
  const data = await api.patch<UserResponse>("/api/user/availability", input);
  return data.user;
}

export async function updateNotificationSpeechApi(muted: boolean): Promise<PublicUser> {
  const data = await api.patch<UserResponse>("/api/user/notification-speech", { muted });
  return data.user;
}

export async function getQuestPacingApi(): Promise<UserQuestPacing> {
  return api.get<UserQuestPacing>("/api/user/quest-pacing");
}
