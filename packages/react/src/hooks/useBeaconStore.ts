import type { BeaconStore } from "@repere/core";
import { useCallback, useEffect, useState } from "react";

export function useBeaconStore(store: BeaconStore, beaconId: string) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkDismissed = async () => {
      setIsLoading(true);
      const dismissed = await Promise.resolve(store.isDismissed(beaconId));
      setIsDismissed(dismissed);
      setIsLoading(false);
    };

    checkDismissed();
  }, [store, beaconId]);

  const dismiss = useCallback(async () => {
    await Promise.resolve(store.dismiss(beaconId));
    setIsDismissed(true);
  }, [store, beaconId]);

  const reset = useCallback(async () => {
    await Promise.resolve(store.reset(beaconId));
    setIsDismissed(false);
  }, [store, beaconId]);

  const resetAll = useCallback(async () => {
    await Promise.resolve(store.resetAll());
    setIsDismissed(false);
  }, [store]);

  return {
    isDismissed,
    isLoading,
    dismiss,
    reset,
    resetAll,
  };
}
