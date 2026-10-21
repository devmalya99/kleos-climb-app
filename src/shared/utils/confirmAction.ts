import { Alert } from "react-native";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
};

/** Native destructive confirmation. Runs `onConfirm` only on explicit approval. */
export function confirmAction(options: ConfirmOptions, onConfirm: () => void) {
  Alert.alert(options.title, options.message, [
    { text: "Cancel", style: "cancel" },
    {
      text: options.confirmLabel ?? "Delete",
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
}
