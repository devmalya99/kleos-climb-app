import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

type DeadlineFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

function digits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

/** Local calendar day, stored as yyyy-mm-dd. No native date module. */
export function DeadlineField({ value, onChange }: DeadlineFieldProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [year, month, day] = value.split("-");
  const [parts, setParts] = useState({
    year: year ?? "",
    month: month ?? "",
    day: day ?? "",
  });

  function commit(next: { year: string; month: string; day: string }) {
    setParts(next);
    onChange(`${next.year}-${next.month}-${next.day}`);
  }

  function blurPart(key: "month" | "day") {
    const raw = parts[key];
    if (!raw) return;
    commit({ ...parts, [key]: raw.padStart(2, "0") });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Summit by</Text>
      <View style={styles.row}>
        <TextInput
          accessibilityLabel="Year"
          value={parts.year}
          onChangeText={(text) => commit({ ...parts, year: digits(text, 4) })}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="YYYY"
          placeholderTextColor={colors.inkSubtle}
          style={[styles.input, styles.year]}
        />
        <TextInput
          accessibilityLabel="Month"
          value={parts.month}
          onChangeText={(text) => commit({ ...parts, month: digits(text, 2) })}
          onBlur={() => blurPart("month")}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          placeholderTextColor={colors.inkSubtle}
          style={[styles.input, styles.short]}
        />
        <TextInput
          accessibilityLabel="Day"
          value={parts.day}
          onChangeText={(text) => commit({ ...parts, day: digits(text, 2) })}
          onBlur={() => blurPart("day")}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="DD"
          placeholderTextColor={colors.inkSubtle}
          style={[styles.input, styles.short]}
        />
      </View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: { gap: spacing.xs },
    label: {
      fontFamily: typography.bodyMedium,
      fontSize: 14,
      color: colors.inkMuted,
    },
    row: { flexDirection: "row", gap: spacing.sm },
    input: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      fontFamily: typography.body,
      fontSize: 16,
      color: colors.ink,
      backgroundColor: colors.surfaceCard,
    },
    year: { flex: 1.4 },
    short: { flex: 1 },
  });
}
