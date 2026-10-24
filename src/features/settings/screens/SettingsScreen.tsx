import Constants from "expo-constants";
import { StyleSheet, Switch, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors, type ThemePreference } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TextField } from "@/shared/components/TextField";

import { QuestPacingSection } from "../components/QuestPacingSection";
import { XP_GOAL_MAX, XP_GOAL_MIN } from "../constants/settings.constants";
import { useSettings } from "../hooks/useSettings";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.1";

const APPEARANCE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function SettingsScreen() {
  const { colors, preference, setPreference } = useTheme();
  const styles = createStyles(colors);

  const settings = useSettings();

  return (
    <Screen scroll contentStyle={styles.content}>
      <ScreenHeader title="Settings" subtitle="Appearance, XP goals, timezone and notifications" />

      <Text style={styles.section}>Appearance</Text>
      <View style={styles.appearance}>
        {APPEARANCE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            label={option.label}
            variant={preference === option.value ? "primary" : "secondary"}
            onPress={() => setPreference(option.value)}
            style={styles.appearanceButton}
          />
        ))}
      </View>

      <Text style={styles.section}>Daily XP goals</Text>
      <TextField
        label={`Weekday XP per day (${XP_GOAL_MIN}–${XP_GOAL_MAX})`}
        value={settings.weekdayXp}
        onChangeText={settings.setWeekdayXp}
        keyboardType="numeric"
        error={settings.fieldErrors.weekdayXpPerDay}
      />
      <TextField
        label={`Weekend XP per day (${XP_GOAL_MIN}–${XP_GOAL_MAX})`}
        value={settings.weekendXp}
        onChangeText={settings.setWeekendXp}
        keyboardType="numeric"
        error={settings.fieldErrors.weekendXpPerDay}
      />
      <TextField
        label="Timezone"
        value={settings.timezone}
        onChangeText={settings.setTimezone}
        placeholder="Asia/Kolkata"
        error={settings.fieldErrors.timezone}
      />
      <Button label="Use device timezone" variant="ghost" onPress={settings.applyDeviceTimezone} />
      {settings.banner ? (
        <Text style={settings.banner.kind === "error" ? styles.error : styles.success}>
          {settings.banner.text}
        </Text>
      ) : null}
      <Button
        label="Save availability"
        onPress={() => void settings.saveAvailability()}
        loading={settings.isSavingAvailability}
      />

      <Text style={styles.section}>Notifications</Text>
      <View style={styles.switchRow}>
        <View style={styles.switchCopy}>
          <Text style={styles.switchTitle}>Mute spoken reminders</Text>
          <Text style={styles.muted}>Stops proactive speech guidance.</Text>
        </View>
        <Switch
          value={settings.speechMuted}
          disabled={settings.isUpdatingSpeech}
          onValueChange={(value) => void settings.setSpeechMuted(value)}
          trackColor={{ true: colors.success, false: colors.border }}
        />
      </View>

      <Text style={styles.section}>AI usage</Text>
      <Text style={styles.muted}>
        {(settings.user?.totalAiTokens ?? 0).toLocaleString()} tokens used in total.
      </Text>

      <Text style={styles.section}>Quest pacing</Text>
      <QuestPacingSection
        pacing={settings.pacing}
        isLoading={settings.isPacingLoading}
        error={settings.pacingError}
        onRetry={settings.retryPacing}
      />
      <Text style={styles.version} accessibilityLabel={`App version ${APP_VERSION}`}>
        v{APP_VERSION}
      </Text>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  section: { fontFamily: typography.bodyBold, fontSize: 18, letterSpacing: -0.2, color: colors.ink, marginTop: spacing.sm },
  muted: { fontFamily: typography.body, fontSize: 14, color: colors.inkMuted },
  error: { fontFamily: typography.bodyMedium, color: colors.danger },
  success: { fontFamily: typography.bodyMedium, color: colors.success },
  switchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  switchCopy: { flex: 1, gap: 2 },
  switchTitle: { fontFamily: typography.bodyBold, fontSize: 16, color: colors.ink },
  appearance: { flexDirection: "row", gap: spacing.sm },
  appearanceButton: { flex: 1 },
  version: {
    marginTop: spacing.lg,
    textAlign: "center",
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkSubtle,
  },
});
}
