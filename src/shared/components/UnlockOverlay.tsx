import { router, type Href } from "expo-router";

import { UNLOCK_COPY, type UnlockKind } from "@/shared/constants/unlocks.constants";

import { Button } from "./Button";
import { ResultOverlay } from "./ResultOverlay";

type UnlockOverlayProps = {
  /** `null` hides the overlay. */
  kind: UnlockKind | null;
  onDismiss: () => void;
};

/** Celebration shown when a server response reports a first-time feature unlock. */
export function UnlockOverlay({ kind, onDismiss }: UnlockOverlayProps) {
  const copy = kind ? UNLOCK_COPY[kind] : null;

  return (
    <ResultOverlay
      visible={Boolean(copy)}
      title={copy?.title ?? ""}
      subtitle={copy?.body}
      tone="success"
      onRequestClose={onDismiss}
      actions={
        <>
          <Button
            label="Take me there"
            onPress={() => {
              onDismiss();
              if (copy) router.push(copy.href as Href);
            }}
          />
          <Button label="Later" variant="ghost" onPress={onDismiss} />
        </>
      }
    />
  );
}
