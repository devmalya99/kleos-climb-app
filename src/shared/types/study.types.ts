export type PublicExam = {
  id: string;
  name: string;
  targetDate: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicRealm = {
  id: string;
  name: string;
  themeKey: string | null;
};

export type TopicPriority = "HIGH" | "MEDIUM" | "LOW";

export type PublicTopic = {
  id: string;
  examId: string;
  name: string;
  description: string | null;
  categoryName: string | null;
  categoryId: string | null;
  priority: TopicPriority;
  xpValue: number;
  resources: string[];
  imageUrl: string | null;
  sortOrder: number;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ParsedTopic = {
  name: string;
  description?: string;
  categoryName: string;
  priority: TopicPriority;
  resources: string[];
};

export type RealmAnalyserStatus = {
  hasBadge: boolean;
  hasReport: boolean;
  tierLabel: string | null;
  canChallenge: boolean;
  retryAt: string | null;
};
