export type FeatureUnlocks = {
  arsenalUnlocked: boolean;
  battleStatsUnlocked: boolean;
  hallOfFameUnlocked: boolean;
};

export type PublicUser = {
  id: string;
  email: string;
  /** Name from onboarding. Empty until they finish, then the trimmed value. */
  displayName: string | null;
  /** Null until the first expedition save. Missing on an older session means already in. */
  onboardedAt: string | null;
  timezone: string;
  weekdayXpPerDay: number;
  weekendXpPerDay: number;
  totalAiTokens: number;
  notificationSpeechMuted: boolean;
  createdAt: string;
  featureUnlocks: FeatureUnlocks;
};

export type AuthResponse = {
  user: PublicUser;
  token: string;
};

export type MeResponse = {
  user: PublicUser;
};
