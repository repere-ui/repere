import { AnchorPoint } from "../types/anchors";
import type { Offset, PositioningStrategy } from "../types/beacon";
import { PositioningStrategy as PS } from "../types/beacon";

export interface BeaconAnchor {
  top: number;
  left: number;
  translate: {
    x: string;
    y: string;
  };
}

/**
 * Calculate beacon anchor coordinates based on element rect and desired anchor point
 */
export function calculateAnchorPointCoords(
  rect: DOMRect,
  anchorPoint: AnchorPoint,
  offset?: Offset,
  strategy: PositioningStrategy = PS.Absolute,
): BeaconAnchor {
  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;

  // For absolute positioning, we need to add scroll offset
  // For fixed positioning, we use viewport coordinates as-is
  const scrollY = strategy === PS.Absolute ? window.scrollY : 0;
  const scrollX = strategy === PS.Absolute ? window.scrollX : 0;

  let top = 0;
  let left = 0;
  let translateX = "0%";
  let translateY = "0%";

  switch (anchorPoint) {
    case AnchorPoint.TopLeft:
      top = rect.top + scrollY;
      left = rect.left + scrollX;
      translateX = "0%";
      translateY = "-100%";
      break;

    case AnchorPoint.TopCenter:
      top = rect.top + scrollY;
      left = rect.left + scrollX + rect.width / 2;
      translateX = "-50%";
      translateY = "-100%";
      break;

    case AnchorPoint.TopRight:
      top = rect.top + scrollY;
      left = rect.right + scrollX;
      translateX = "-100%";
      translateY = "-100%";
      break;

    case AnchorPoint.RightCenter:
      top = rect.top + scrollY + rect.height / 2;
      left = rect.right + scrollX;
      translateX = "0%";
      translateY = "-50%";
      break;

    case AnchorPoint.BottomRight:
      top = rect.bottom + scrollY;
      left = rect.right + scrollX;
      translateX = "-100%";
      translateY = "0%";
      break;

    case AnchorPoint.BottomCenter:
      top = rect.bottom + scrollY;
      left = rect.left + scrollX + rect.width / 2;
      translateX = "-50%";
      translateY = "0%";
      break;

    case AnchorPoint.BottomLeft:
      top = rect.bottom + scrollY;
      left = rect.left + scrollX;
      translateX = "0%";
      translateY = "0%";
      break;

    case AnchorPoint.LeftCenter:
      top = rect.top + scrollY + rect.height / 2;
      left = rect.left + scrollX;
      translateX = "-100%";
      translateY = "-50%";
      break;

    default:
      // Default to top-right
      top = rect.top + scrollY;
      left = rect.right + scrollX;
      translateX = "-100%";
      translateY = "-100%";
      break;
  }

  // Apply offsets
  top += offsetY;
  left += offsetX;

  return {
    top,
    left,
    translate: { x: translateX, y: translateY },
  };
}
