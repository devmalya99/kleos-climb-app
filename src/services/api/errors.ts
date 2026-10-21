export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) {
    if (typeof error.body === "object" && error.body && "error" in error.body) {
      const value = (error.body as { error: unknown }).error;
      if (typeof value === "string") return value;
      // Zod `flatten().fieldErrors` shape: { field: string[] }.
      if (typeof value === "object" && value) {
        const first = Object.values(value as Record<string, unknown>)
          .flat()
          .find((item): item is string => typeof item === "string");
        if (first) return first;
      }
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
