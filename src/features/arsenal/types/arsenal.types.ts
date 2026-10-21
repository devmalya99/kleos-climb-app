export type PublicSkill = {
  id: string;
  name: string;
  xp: number;
  /** NOVICE → SUPREME. */
  rank: string;
  rankLabel: string;
  progressPercent: number;
  xpToNextRank: number | null;
  nextRankLabel: string | null;
};

export type ArsenalData = {
  skills: PublicSkill[];
  totalSkills: number;
  totalXp: number;
  highestRank: string | null;
};
