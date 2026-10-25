import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { resolveDisplayName, useAuth } from "@/features/auth";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import { Button } from "@/shared/components/Button";
import { ListRow } from "@/shared/components/ListRow";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { confirmAction } from "@/shared/utils/confirmAction";

const APP_VERSION = "1.0.3";

export function ProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLogout() {
    confirmAction(
      { title: "Sign out?", message: "You will need to sign in again.", confirmLabel: "Sign out" },
      async () => {
        setSigningOut(true);
        setError(null);
        try {
          await logout();
          router.replace("/(auth)/welcome");
        } catch (err) {
          logger.error("Logout failed", { message: getErrorMessage(err) });
          setError(getErrorMessage(err, "Could not sign out"));
          setSigningOut(false);
        }
      },
    );
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Profile" />
      <ListRow title="Name" subtitle={resolveDisplayName(user) || "—"} />
      <ListRow title="Email" subtitle={user?.email ?? "—"} />
      <ListRow title="Timezone" subtitle={user?.timezone ?? "—"} />
      <ListRow
        title="Daily XP goals"
        subtitle={`Weekdays ${user?.weekdayXpPerDay ?? 0} · Weekends ${user?.weekendXpPerDay ?? 0}`}
        onPress={() => router.push("/more/settings")}
        right="EDIT"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Sign out" variant="danger" loading={signingOut} onPress={handleLogout} />
      <Text style={styles.version} accessibilityLabel={`App version ${APP_VERSION}`}>
        v{APP_VERSION}
      </Text>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
  version: {
    marginTop: "auto",
    paddingTop: spacing.lg,
    textAlign: "center",
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSubtle,
  },
});
}
