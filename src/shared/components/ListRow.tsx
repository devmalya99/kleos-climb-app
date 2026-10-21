import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";

import { PressableScale } from "./PressableScale";

type ListRowProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
  right?: string;
  locked?: boolean;
};

export function ListRow({
  title,
  subtitle,
  meta,
  onPress,
  right,
  locked,
}: ListRowProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const content = (
    <View style={[styles.row, locked ? styles.locked : null]}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      {right ? <Text style={styles.right}>{right}</Text> : null}
    </View>
  );

  if (!onPress) return content;

  return <PressableScale onPress={onPress}>{content}</PressableScale>;
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  row: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  locked: {
    opacity: 0.55,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkMuted,
  },
  meta: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: colors.inkSubtle,
  },
  right: {
    fontFamily: typography.bodyBold,
    color: colors.ink,
    fontSize: 13,
  },
});
}
