export type FeatureUnlocks = {
  arsenalUnlocked: boolean;
  battleStatsUnlocked: boolean;
  hallOfFameUnlocked: boolean;
};

export type PublicUser = {
  id: string;
  email: string;
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
