import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { typography, useTheme } from "@/app/theme";
import { Button } from "@/shared/components/Button";
import { SheetModal } from "@/shared/components/SheetModal";

import { climbChrome } from "../utils/climb-chrome";

type ExpeditionMenuSheetProps = {
  visible: boolean;
  deleting: boolean;
  onClose: () => void;
  onNewSummit: () => void;
  onDelete: () => void;
};

/** New expedition and delete, with a second tap before the delete runs. */
export function ExpeditionMenuSheet({
  visible,
  deleting,
  onClose,
  onNewSummit,
  onDelete,
}: ExpeditionMenuSheetProps) {
  const { scheme } = useTheme();
  const chrome = climbChrome(scheme);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!visible) setConfirmDelete(false);
  }, [visible]);

  function close() {
    setConfirmDelete(false);
    onClose();
  }

  return (
    <SheetModal visible={visible} title="Expedition" onClose={close}>
      <Button
        label="New expedition"
        variant="secondary"
        onPress={() => {
          setConfirmDelete(false);
          onClose();
          onNewSummit();
        }}
      />
      {confirmDelete ? (
        <>
          <Text style={[styles.warning, { color: chrome.muted }]}>
            This deletes the entire expedition, including every camp and task. Other expeditions stay.
          </Text>
          <Button
            label="Delete expedition"
            variant="danger"
            loading={deleting}
            onPress={() => {
              onDelete();
              setConfirmDelete(false);
              onClose();
            }}
          />
          <Button label="Cancel" variant="ghost" onPress={() => setConfirmDelete(false)} />
        </>
      ) : (
        <Button label="Delete expedition" variant="danger" onPress={() => setConfirmDelete(true)} />
      )}
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  warning: { fontFamily: typography.body, fontSize: 15, lineHeight: 22 },
});
