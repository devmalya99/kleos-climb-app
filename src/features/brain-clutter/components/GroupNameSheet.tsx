import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { groupNameSchema } from "../utils/clutter.schemas";

type GroupNameSheetProps = {
  /** Current name when renaming; null creates a new bucket. Mount only while open. */
  initialName: string | null;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export function GroupNameSheet({
  initialName,
  saving,
  error,
  onClose,
  onSubmit,
}: GroupNameSheetProps) {
  const [name, setName] = useState(initialName ?? "");
  const [fieldError, setFieldError] = useState<string | undefined>();

  function handleSave() {
    const parsed = groupNameSchema.safeParse(name);
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message);
      return;
    }
    setFieldError(undefined);
    onSubmit(parsed.data);
  }

  return (
    <SheetModal
      visible
      title={initialName === null ? "New bucket" : "Rename bucket"}
      onClose={onClose}
    >
      <TextField
        label="Bucket name"
        value={name}
        onChangeText={setName}
        autoCapitalize="sentences"
        error={fieldError ?? error ?? undefined}
      />
      <Button
        label={initialName === null ? "Create bucket" : "Save name"}
        onPress={handleSave}
        loading={saving}
      />
    </SheetModal>
  );
}
