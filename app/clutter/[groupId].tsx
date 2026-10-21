import { useLocalSearchParams } from "expo-router";

import { GroupDetailScreen } from "@/features/brain-clutter";

export default function ClutterGroupRoute() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <GroupDetailScreen groupId={groupId} />;
}
