import { StyleSheet, View } from "react-native";

import { spacing } from "@/app/theme";
import { ListRow } from "@/shared/components/ListRow";

import type { ClimbSession } from "../types/climb.types";

type SummitSwitcherProps = {
  sessions: ClimbSession[];
  climbId: string;
  onOpen: (id: string) => void;
};

export function SummitSwitcher({ sessions, climbId, onOpen }: SummitSwitcherProps) {
  return (
    <View style={styles.wrap}>
      {sessions.map((session) => {
        const open = session.id === climbId;
        return (
          <ListRow
            key={session.id}
            title={session.goal}
            subtitle={`${session.clearedLevels}/${session.totalLevels} camps · ${session.deadline}`}
            right={open ? "OPEN" : "Open"}
            onPress={open ? undefined : () => onOpen(session.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
});
