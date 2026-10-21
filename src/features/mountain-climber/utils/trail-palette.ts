export type TrailPalette = {
  paper: string;
  ink: string;
  inkSoft: string;
  rule: string;
  walked: string;
  note: string;
  noteInk: string;
  here: string;
  hereInk: string;
};

/** Stained chart colors, separate from the app chrome so the trail reads as a map. */
export function trailPalette(scheme: "light" | "dark"): TrailPalette {
  if (scheme === "dark") {
    return {
      paper: "#241C14",
      ink: "#F0E2C8",
      inkSoft: "#C4B096",
      rule: "#8C7352",
      walked: "#3DDC97",
      note: "#31261C",
      noteInk: "#F6EBD8",
      here: "#E6B325",
      hereInk: "#1C1408",
    };
  }
  return {
    paper: "#F3E4C8",
    ink: "#3B2918",
    inkSoft: "#7A6248",
    rule: "#C4A574",
    walked: "#1F7A56",
    note: "#FFF9F0",
    noteInk: "#2C2118",
    here: "#E6B325",
    hereInk: "#1C1408",
  };
}
