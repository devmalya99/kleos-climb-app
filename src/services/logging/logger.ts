type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta === undefined ? message : `${message} ${JSON.stringify(meta)}`;
  if (level === "error") {
    console.error(`[Kleos] ${payload}`);
    return;
  }
  if (level === "warn") {
    console.warn(`[Kleos] ${payload}`);
    return;
  }
  if (__DEV__) {
    console.log(`[Kleos] ${payload}`);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
};
