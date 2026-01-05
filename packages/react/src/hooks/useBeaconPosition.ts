import type { CalculatedBeaconPosition, Offset, Position } from "@repere/core";
import { PositionTracker } from "@repere/core";
import { useEffect, useMemo, useState } from "react";

interface UseBeaconPositionParams {
  targetSelector: string;
  position: Position;
  offset?: Offset;
  zIndex?: number;
  delay?: number;
  enabled?: boolean;
  debug?: boolean;
}

export function useBeaconPosition({
  targetSelector,
  position,
  offset,
  zIndex = 9999,
  delay,
  enabled = true,
  debug = false,
}: UseBeaconPositionParams) {
  const [calculatedPosition, setCalculatedPosition] =
    useState<CalculatedBeaconPosition | null>(null);

  const tracker = useMemo(() => new PositionTracker(debug), [debug]);

  useEffect(() => {
    if (!enabled) {
      setCalculatedPosition(null);
      return;
    }

    // Subscribe to position updates
    const unsubscribe = tracker.subscribe(
      targetSelector,
      position,
      setCalculatedPosition,
      { offset, zIndex, delay },
    );

    return unsubscribe;
  }, [tracker, targetSelector, position, offset, zIndex, delay, enabled]);

  // Clean up tracker on unmount
  useEffect(() => {
    return () => tracker.destroy();
  }, [tracker]);

  return {
    calculatedPosition,
    targetElement: calculatedPosition
      ? (document.querySelector(targetSelector) as HTMLElement)
      : null,
  };
}
