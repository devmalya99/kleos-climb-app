import { ENV } from "@/app/config/env";
import { ApiError } from "@/services/api/errors";
import { logger } from "@/services/logging/logger";
import {
  clearSessionToken,
  getSessionToken,
} from "@/services/storage/secure-session";

type UnauthorizedHandler = () => void | Promise<void>;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  headers?: Record<string, string>;
  auth?: boolean;
  raw?: boolean;
};

/** Clears the session and runs the registered sign-out handler. Always throws. */
export async function failUnauthorized(): Promise<never> {
  await clearSessionToken();
  if (onUnauthorized) {
    await onUnauthorized();
  }
  throw new ApiError("Unauthorized", 401);
}

export async function buildHeaders(options: RequestOptions): Promise<Headers> {
  const headers = new Headers(options.headers);
  if (!options.formData && !headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth !== false) {
    const token = await getSessionToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${ENV.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = await buildHeaders(options);

  const response = await fetch(url, {
    method: options.method ?? (options.body || options.formData ? "POST" : "GET"),
    headers,
    body: options.formData
      ? options.formData
      : options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  // Authenticated calls: 401 means the session is dead.
  // Unauthenticated calls (login/signup): 401 is a normal credential error.
  if (response.status === 401 && options.auth !== false) {
    return failUnauthorized();
  }

  if (options.raw) {
    if (!response.ok) {
      throw new ApiError(`Request failed (${response.status})`, response.status);
    }
    return response as unknown as T;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data && typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${response.status})`;
    logger.warn("API error", { path, status: response.status, message });
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

type ApiCallOptions = Pick<RequestOptions, "auth" | "headers">;

export const api = {
  get: <T>(path: string, options?: ApiCallOptions) =>
    apiRequest<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body?: unknown, options?: ApiCallOptions) =>
    apiRequest<T>(path, { method: "POST", body, ...options }),
  patch: <T>(path: string, body?: unknown, options?: ApiCallOptions) =>
    apiRequest<T>(path, { method: "PATCH", body, ...options }),
  delete: <T>(path: string, body?: unknown, options?: ApiCallOptions) =>
    apiRequest<T>(path, { method: "DELETE", body, ...options }),
  postForm: <T>(path: string, formData: FormData, options?: ApiCallOptions) =>
    apiRequest<T>(path, { method: "POST", formData, ...options }),
};
