import type { CalculatedBeaconPosition, Offset, Position } from "@repere/core";
import { calculateBeaconPosition } from "@repere/core";
import { useEffect, useRef, useState } from "react";

interface UseBeaconPositionParams {
  targetSelector: string;
  position: Position;
  offset?: Offset;
  zIndex?: number;
  enabled?: boolean;
  debug?: boolean;
}

export function useBeaconPosition({
  targetSelector,
  position,
  offset,
  zIndex = 9999,
  enabled = true,
  debug = false,
}: UseBeaconPositionParams) {
  const [calculatedPosition, setCalculatedPosition] =
    useState<CalculatedBeaconPosition | null>(null);
  const targetElementRef = useRef<HTMLElement | null>(null);

  const updatePosition = () => {
    if (!enabled) return;

    const element = document.querySelector(targetSelector) as HTMLElement;
    if (!element) {
      if (debug) {
        console.log(
          `[Repere] useBeaconPosition: Target element not found: ${targetSelector}`,
        );
      }
      setCalculatedPosition(null);
      targetElementRef.current = null;
      return;
    }

    targetElementRef.current = element;
    const rect = element.getBoundingClientRect();

    // ✅ Use core positioning logic
    const coords = calculateBeaconPosition(rect, position, offset);

    const newPosition = {
      ...coords,
      position: "fixed" as const,
      zIndex,
    };

    if (debug) {
      console.log(
        `[Repere] useBeaconPosition: Calculated position for ${targetSelector}:`,
        newPosition,
      );
    }

    setCalculatedPosition(newPosition);
  };

  useEffect(() => {
    updatePosition();

    // Watch for scroll
    const handleScroll = () => updatePosition();
    window.addEventListener("scroll", handleScroll, true);

    // Watch for resize
    const handleResize = () => updatePosition();
    window.addEventListener("resize", handleResize);

    // Watch for target element resize using ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (targetElementRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => updatePosition());
      resizeObserver.observe(targetElementRef.current);
    }

    // Watch for DOM mutations
    const mutationObserver = new MutationObserver(() => {
      const element = document.querySelector(targetSelector);
      if (element && !targetElementRef.current) {
        updatePosition();
      } else if (!element && targetElementRef.current) {
        setCalculatedPosition(null);
        targetElementRef.current = null;
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
    };
  }, [targetSelector]);

  return { calculatedPosition, targetElement: targetElementRef.current };
}
