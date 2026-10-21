import type {
  ParsedTopic,
  PublicRealm,
  RealmAnalyserStatus,
} from "@/shared/types/study.types";

export type RealmsResponse = { realms: PublicRealm[] };
export type RealmResponse = { realm: PublicRealm };

export type DeleteRealmResult = {
  deletedTopics: number;
  deletedCategory: boolean;
};

/** Keyed by realm (category) id. */
export type AnalyserStatusesResponse = {
  statuses: Record<string, RealmAnalyserStatus>;
};

export type AutofillInput = {
  realmName: string;
  topicsHint: string;
};

export type AutofillResponse = {
  topics: ParsedTopic[];
  realmName: string;
  message?: string;
};
