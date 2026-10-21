type LogLevel = "info" | "warn" | "error";

function write(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta === undefined ? message : `${message} ${JSON.stringify(meta)}`;
  if (level === "error") {
    console.error(`[PaceMaker] ${payload}`);
    return;
  }
  if (level === "warn") {
    console.warn(`[PaceMaker] ${payload}`);
    return;
  }
  if (__DEV__) {
    console.log(`[PaceMaker] ${payload}`);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
};
