import { fetch as streamingFetch } from "expo/fetch";

import { ENV } from "@/app/config/env";
import { ApiError } from "@/services/api/errors";
import { logger } from "@/services/logging/logger";

import { buildHeaders, failUnauthorized } from "./client";

type StreamOptions = {
  body: unknown;
  signal?: AbortSignal;
};

/**
 * POST that keeps the response open so the caller can read `response.body`
 * incrementally (server-sent events). Uses Expo's streaming `fetch`, because
 * React Native's global `fetch` buffers the whole body.
 */
export async function apiStream(path: string, options: StreamOptions) {
  const url = `${ENV.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = await buildHeaders({ body: options.body });
  headers.set("Accept", "text/event-stream");

  const response = await streamingFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(options.body),
    signal: options.signal,
  });

  if (response.status === 401) {
    return failUnauthorized();
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = (await response.json()) as { error?: unknown };
      if (typeof data.error === "string") message = data.error;
    } catch {
      // Non-JSON error body: keep the generic status message.
    }
    logger.warn("API stream error", { path, status: response.status, message });
    throw new ApiError(message, response.status);
  }

  return response;
}
