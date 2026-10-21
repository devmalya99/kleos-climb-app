import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { useAuth } from "@/features/auth";
import { ListRow } from "@/shared/components/ListRow";
import { Screen } from "@/shared/components/Screen";

import { MORE_ITEMS } from "../constants/home.constants";
import { useFeatureAccess } from "../hooks/useFeatureAccess";

export function MoreScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { user } = useAuth();
  const access = useFeatureAccess(user?.featureUnlocks);

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={styles.title}>More</Text>
      <View style={styles.list}>
        {MORE_ITEMS.map((item) => {
          const locked = access.isLocked(item);
          return (
            <ListRow
              key={item.key}
              title={item.title}
              subtitle={locked ? item.lockedHint : item.subtitle}
              right={locked ? "LOCKED" : undefined}
              locked={locked}
              onPress={() => access.open(item)}
            />
          );
        })}
      </View>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 32,
    letterSpacing: -0.6,
    color: colors.ink,
  },
  list: { gap: spacing.sm },
});
}
