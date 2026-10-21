export type TaurusChrome = {
  page: string;
  ink: string;
  muted: string;
  subtle: string;
  line: string;
  card: string;
  cardRaised: string;
  honey: string;
  honeyInk: string;
  mark: string;
  markInk: string;
  userBorder: string;
  blue: string;
  danger: string;
  /** Muted cyan for list markers and inline code. */
  cyan: string;
  /** Quote bar. */
  violet: string;
  /** Link text. */
  sky: string;
  /** Fenced code sits on a dark panel in both schemes. */
  codePanel: string;
  codeInk: string;
  codeMuted: string;
  /** Inline `code` chip, tuned to the bubble behind it. */
  codeChip: string;
};

const DARK: TaurusChrome = {
      page: "#07090F",
      ink: "#F4F7FB",
      muted: "#A7B0C0",
      subtle: "#7E8796",
      line: "#2A3142",
      card: "#121826",
      cardRaised: "#0E1420",
      honey: "#F5C518",
      honeyInk: "#1A1404",
      mark: "#F07A54",
      markInk: "#FFFFFF",
      userBorder: "#E0B03A",
      blue: "#4C8DFF",
  danger: "#FF6B6B",
  cyan: "#7DCEC6",
  violet: "#B79CFF",
  sky: "#7EBEFF",
  codePanel: "#0B1018",
  codeInk: "#E8EEF6",
  codeMuted: "#8B97A8",
  codeChip: "#152028",
};

const LIGHT: TaurusChrome = {
    page: "#F7F4EF",
    ink: "#1C1917",
    muted: "#6B6158",
    subtle: "#94897E",
    line: "#E4D9C8",
    card: "#FFFFFF",
    cardRaised: "#F3EEE6",
    honey: "#E6B325",
    honeyInk: "#1C1408",
    mark: "#F07A54",
    markInk: "#FFFFFF",
    userBorder: "#C4922A",
    blue: "#3B6FD8",
    danger: "#C94545",
    cyan: "#2F7A72",
    violet: "#6E56CF",
    sky: "#2F6FDB",
    codePanel: "#0B1018",
    codeInk: "#E8EEF6",
    codeMuted: "#8B97A8",
    codeChip: "#E5F3F1",
};

/** Chat colors for the Taurus layout. Dark matches the night chat mock. */
export function taurusChrome(scheme: "light" | "dark"): TaurusChrome {
  return scheme === "dark" ? DARK : LIGHT;
}
