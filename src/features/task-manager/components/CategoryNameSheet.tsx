import { useState } from "react";

import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";
import { TextField } from "@/shared/components/TextField";

import { categoryNameSchema } from "../utils/taskManager.schemas";

type CategoryNameSheetProps = {
  /** Current name when renaming; null creates a new category. Mount only while open. */
  initialName: string | null;
  saving: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

export function CategoryNameSheet({
  initialName,
  saving,
  error,
  onClose,
  onSubmit,
}: CategoryNameSheetProps) {
  const [name, setName] = useState(initialName ?? "");
  const [fieldError, setFieldError] = useState<string | undefined>();

  function handleSave() {
    const parsed = categoryNameSchema.safeParse(name);
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
      title={initialName === null ? "New category" : "Rename category"}
      onClose={onClose}
    >
      <TextField
        label="Category name"
        value={name}
        onChangeText={setName}
        autoCapitalize="sentences"
        error={fieldError ?? error ?? undefined}
      />
      <Button
        label={initialName === null ? "Create category" : "Save name"}
        onPress={handleSave}
        loading={saving}
      />
    </SheetModal>
  );
}
