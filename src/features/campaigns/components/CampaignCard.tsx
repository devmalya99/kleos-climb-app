import { ListRow } from "@/shared/components/ListRow";
import type { PublicExam } from "@/shared/types/study.types";

import { describeDaysLeft, daysUntil, formatTargetDate } from "../utils/campaignDates";

type CampaignCardProps = {
  campaign: PublicExam;
  onPress: () => void;
};

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  return (
    <ListRow
      title={campaign.name}
      subtitle={`Target ${formatTargetDate(campaign.targetDate)}`}
      meta={describeDaysLeft(daysUntil(campaign.targetDate))}
      right="OPEN"
      onPress={onPress}
    />
  );
}
