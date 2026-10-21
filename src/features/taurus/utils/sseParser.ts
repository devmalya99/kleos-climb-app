/**
 * Incremental server-sent-events parser. Feed it decoded text as it arrives;
 * it calls `onData` once per complete event with the joined `data:` payload.
 */
export function createSseParser(onData: (data: string) => void) {
  let buffer = "";

  return {
    push(text: string) {
      // Normalise on the whole buffer so a "\r\n" split across reads still matches.
      buffer = (buffer + text).replace(/\r\n/g, "\n");

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const block = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        const data = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");
        if (data) onData(data);

        boundary = buffer.indexOf("\n\n");
      }
    },
  };
}
