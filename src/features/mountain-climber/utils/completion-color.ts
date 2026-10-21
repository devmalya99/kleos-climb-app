const STOPS: { at: number; rgb: [number, number, number] }[] = [
  { at: 0, rgb: [255, 255, 255] },
  { at: 25, rgb: [254, 249, 195] },
  { at: 50, rgb: [202, 138, 4] },
  { at: 75, rgb: [134, 239, 172] },
  { at: 100, rgb: [22, 101, 52] },
];

/** White, then light yellow, deep yellow, light green, and deep green. */
export function completionColor(percent: number): string {
  const value = Math.max(0, Math.min(100, percent));
  const upperIndex = Math.max(1, STOPS.findIndex((stop) => stop.at >= value));
  const upper = STOPS[upperIndex] ?? STOPS[STOPS.length - 1];
  const lower = STOPS[upperIndex - 1] ?? upper;
  const span = upper.at - lower.at;
  const mix = span === 0 ? 0 : (value - lower.at) / span;
  const rgb = lower.rgb.map((channel, index) =>
    Math.round(channel + (upper.rgb[index] - channel) * mix),
  );
  return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
}
