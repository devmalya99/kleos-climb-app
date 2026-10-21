import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { logger } from "@/services/logging/logger";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";
import type { PublicExam } from "@/shared/types/study.types";

import { useCampaignMutations } from "../hooks/useCampaignMutations";
import { campaignFormSchema } from "../utils/campaign.schemas";
import { toDateOnly } from "../utils/campaignDates";

type CampaignFormSheetProps = {
  /** Campaign to edit; omit to forge a new one. Mount only while open so state resets. */
  campaign?: PublicExam | null;
  onClose: () => void;
  onSaved?: (campaign: PublicExam) => void;
};

export function CampaignFormSheet({ campaign, onClose, onSaved }: CampaignFormSheetProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { create, update } = useCampaignMutations();
  const [name, setName] = useState(campaign?.name ?? "");
  const [targetDate, setTargetDate] = useState(
    campaign ? toDateOnly(campaign.targetDate) : "",
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const saving = create.isPending || update.isPending;

  async function handleSave() {
    setBanner(null);
    const parsed = campaignFormSchema.safeParse({ name, targetDate });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0] ?? "form")] ??= issue.message;
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
    try {
      const saved = campaign
        ? await update.mutateAsync({ examId: campaign.id, input: parsed.data })
        : await create.mutateAsync(parsed.data);
      onClose();
      onSaved?.(saved);
    } catch (err) {
      logger.warn("Save campaign failed", { message: getErrorMessage(err) });
      setBanner(getErrorMessage(err, "Could not save campaign"));
    }
  }

  return (
    <SheetModal
      visible
      title={campaign ? "Edit campaign" : "Forge campaign"}
      onClose={onClose}
    >
      <TextField
        label="Campaign name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholder="e.g. NEET 2027"
        error={fieldErrors.name}
      />
      <TextField
        label="Target date (YYYY-MM-DD)"
        value={targetDate}
        onChangeText={setTargetDate}
        placeholder="2027-05-01"
        error={fieldErrors.targetDate}
      />
      {banner ? (
        <Text style={styles.banner}>{banner}</Text>
      ) : null}
      <Button
        label={campaign ? "Save changes" : "Forge campaign"}
        onPress={() => void handleSave()}
        loading={saving}
      />
    </SheetModal>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  banner: {
    fontFamily: typography.bodyMedium,
    color: colors.danger,
  },
});
}
