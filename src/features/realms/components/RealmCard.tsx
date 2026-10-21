import type { PublicRealm } from "@/shared/types/study.types";
import { ListRow } from "@/shared/components/ListRow";

type RealmCardProps = {
  realm: PublicRealm;
  questCount: number;
  tierLabel?: string | null;
  onPress: () => void;
};

export function RealmCard({ realm, questCount, tierLabel, onPress }: RealmCardProps) {
  return (
    <ListRow
      title={realm.name}
      subtitle={`${questCount} ${questCount === 1 ? "quest" : "quests"}`}
      meta={tierLabel ? `Tier: ${tierLabel}` : undefined}
      right="OPEN"
      onPress={onPress}
    />
  );
}
