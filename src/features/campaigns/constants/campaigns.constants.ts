export const CAMPAIGN_QUERY_KEYS = {
  list: ["campaigns"] as const,
  detail: (examId: string) => ["campaigns", examId] as const,
};

export const CAMPAIGN_NAME_MAX = 120;
export const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MS_PER_DAY = 86_400_000;

export const campaignHref = {
  detail: (examId: string) => `/campaign/${examId}` as const,
  importPlan: (examId: string) => `/import-plan/${examId}` as const,
};
