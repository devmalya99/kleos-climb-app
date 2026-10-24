import { z } from "zod";

import { ApiError, api } from "@/services/api";

import { onboardingRequestSchema, type OnboardingRequest } from "../model/schemas";

const responseSchema = z.object({
  alreadyOnboarded: z.boolean(),
});

export async function completeOnboardingApi(
  input: OnboardingRequest,
): Promise<{ alreadyOnboarded: boolean }> {
  const body = onboardingRequestSchema.parse(input);
  const data = await api.post<unknown>("/api/user/onboarding", body);
  const parsed = responseSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Could not save onboarding", 500);
  }
  return parsed.data;
}
