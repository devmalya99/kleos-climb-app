export type AssistantStep = {
  title: string;
  body: string;
};

export type AssistantLayout = {
  rich: boolean;
  title: string | null;
  badge: string | null;
  intro: string;
  steps: AssistantStep[];
};

const STEP_LINE = /^(\d+)[.)]\s+(.*)$/;
const BADGE_LINE = /^(elevation|altitude)\s*:\s*(.+)$/i;
const TITLE_LIMIT = 48;

/** Turns a plain assistant reply into the insight card when it has steps or an elevation line. */
export function layoutAssistantMessage(text: string): AssistantLayout {
  const badge = takeBadge(text);
  const steps: AssistantStep[] = [];
  const introLines: string[] = [];
  let inSteps = false;

  for (const line of badge.lines) {
    const step = line.trim().match(STEP_LINE);
    if (step) {
      inSteps = true;
      steps.push(splitStep(step[2] ?? ""));
      continue;
    }
    if (inSteps && line.trim() && steps.length > 0) {
      const last = steps[steps.length - 1];
      if (last) last.body = last.body ? `${last.body} ${line.trim()}` : line.trim();
      continue;
    }
    introLines.push(line);
  }

  const intro = introLines.join("\n").trim();
  const titled = steps.length > 0 ? takeTitle(intro) : { title: null, body: intro };

  return {
    rich: steps.length > 0 || badge.label !== null,
    title: titled.title,
    badge: badge.label,
    intro: titled.body,
    steps,
  };
}

function takeBadge(text: string): { label: string | null; lines: string[] } {
  let label: string | null = null;
  const lines: string[] = [];

  for (const line of text.split("\n")) {
    const match = line.trim().match(BADGE_LINE);
    if (match?.[1] && match[2] && label === null) {
      const word = match[1].toLowerCase();
      label = `${word.charAt(0).toUpperCase()}${word.slice(1)}: ${match[2].trim()}`;
      continue;
    }
    lines.push(line);
  }

  return { label, lines };
}

function takeTitle(intro: string): { title: string | null; body: string } {
  const parts = intro.split("\n").map((line) => line.trim()).filter(Boolean);
  const first = parts[0];
  if (!first || first.length > TITLE_LIMIT || first.endsWith(".")) {
    return { title: null, body: intro };
  }
  return { title: first, body: parts.slice(1).join("\n") };
}

function splitStep(raw: string): AssistantStep {
  const bold = raw.match(/^\*\*(.+?)\*\*\s*:?\s*(.*)$/);
  if (bold?.[1]) return { title: bold[1], body: bold[2] ?? "" };

  const colon = raw.match(/^([^:]{1,60}):\s*(.+)$/);
  if (colon?.[1] && colon[2]) return { title: colon[1], body: colon[2] };

  return { title: raw, body: "" };
}
