import type {
  AnchorPoint,
  CalculatedBeaconAnchorPoint,
  Offset,
  PositioningStrategy,
} from "@repere/core";
import { AnchorPointTracker } from "@repere/core";
import { useEffect, useMemo, useState } from "react";

interface UseBeaconAnchorParams {
  targetSelector: string;
  anchorPoint: AnchorPoint;
  offset?: Offset;
  zIndex?: number;
  delay?: number;
  positioningStrategy?: PositioningStrategy;
  enabled?: boolean;
  debug?: boolean;
}

export function useBeaconAnchor({
  targetSelector,
  anchorPoint,
  offset,
  zIndex = 9999,
  delay,
  positioningStrategy,
  enabled = true,
  debug = false,
}: UseBeaconAnchorParams) {
  const [calculatedAnchorPoint, setCalculatedAnchorPoint] =
    useState<CalculatedBeaconAnchorPoint | null>(null);

  const tracker = useMemo(() => new AnchorPointTracker(debug), [debug]);

  useEffect(() => {
    if (!enabled) {
      setCalculatedAnchorPoint(null);
      return;
    }

    // Subscribe to anchor point updates
    const unsubscribe = tracker.subscribe(
      targetSelector,
      anchorPoint,
      setCalculatedAnchorPoint,
      { offset, zIndex, delay, positioningStrategy },
    );

    return unsubscribe;
  }, [
    tracker,
    targetSelector,
    anchorPoint,
    offset,
    zIndex,
    delay,
    positioningStrategy,
    enabled,
  ]);

  // Clean up tracker on unmount
  useEffect(() => {
    return () => tracker.destroy();
  }, [tracker]);

  return {
    calculatedAnchorPoint,
    targetElement: calculatedAnchorPoint
      ? (document.querySelector(targetSelector) as HTMLElement)
      : null,
  };
}
