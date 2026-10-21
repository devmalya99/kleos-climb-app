import { StyleSheet, Text, View } from "react-native";

import { radius, spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { ChipButton } from "@/shared/components/ChipButton";

import type { PickedPdf } from "../types/ragQuiz.types";
import { formatBytes } from "../utils/ragQuiz.utils";

type PdfPickListProps = {
  files: PickedPdf[];
  onRemove: (uri: string) => void;
};

export function PdfPickList({ files, onRemove }: PdfPickListProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (files.length === 0) return null;

  return (
    <View style={styles.list}>
      {files.map((file) => (
        <View key={file.uri} style={styles.row}>
          <View style={styles.copy}>
            <Text style={styles.name} numberOfLines={1}>
              {file.name}
            </Text>
            <Text style={styles.size}>{formatBytes(file.size)}</Text>
          </View>
          <ChipButton label="Remove" danger onPress={() => onRemove(file.uri)} />
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  list: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: typography.bodyBold, fontSize: 15, color: colors.ink },
  size: { fontFamily: typography.body, fontSize: 13, color: colors.inkSubtle },
});
}
