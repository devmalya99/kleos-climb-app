import { ApiError } from "@/services/api";

/** The server answers 403 for features the user has not unlocked yet. */
export function isLockedError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}
