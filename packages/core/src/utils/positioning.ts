import { Position } from "../types/position";

export interface PositionOffset {
  x?: number;
  y?: number;
}

export interface PositionCoordinates {
  top: number;
  left: number;
  translate: {
    x: string;
    y: string;
  };
}

/**
 * Calculate beacon position relative to target element
 */
export function calculateBeaconPosition(
  targetRect: DOMRect,
  position: Position = Position.TopRight,
  offset: PositionOffset = { x: 0, y: 0 },
): PositionCoordinates {
  const { x: offsetX = 0, y: offsetY = 0 } = offset;
  let top = 0;
  let left = 0;
  let translateX = "0";
  let translateY = "0";

  switch (position) {
    // Top positions
    case Position.TopLeft:
      top = targetRect.top + window.scrollY;
      left = targetRect.left + window.scrollX;
      translateX = "-50%";
      translateY = "-100%";
      break;
    case Position.TopCenter:
      top = targetRect.top + window.scrollY;
      left = targetRect.left + window.scrollX + targetRect.width / 2;
      translateX = "-50%";
      translateY = "-100%";
      break;
    case Position.TopRight:
      top = targetRect.top + window.scrollY;
      left = targetRect.right + window.scrollX;
      translateX = "-50%";
      translateY = "-100%";
      break;

    // Right positions
    case Position.RightCenter:
      top = targetRect.top + window.scrollY + targetRect.height / 2;
      left = targetRect.right + window.scrollX;
      translateX = "0";
      translateY = "-50%";
      break;

    // Bottom positions
    case Position.BottomLeft:
      top = targetRect.bottom + window.scrollY;
      left = targetRect.left + window.scrollX;
      translateX = "-50%";
      translateY = "0";
      break;
    case Position.BottomCenter:
      top = targetRect.bottom + window.scrollY;
      left = targetRect.left + window.scrollX + targetRect.width / 2;
      translateX = "-50%";
      translateY = "0";
      break;
    case Position.BottomRight:
      top = targetRect.bottom + window.scrollY;
      left = targetRect.right + window.scrollX;
      translateX = "-50%";
      translateY = "0";
      break;

    // Left positions
    case Position.LeftCenter:
      top = targetRect.top + window.scrollY + targetRect.height / 2;
      left = targetRect.left + window.scrollX;
      translateX = "-100%";
      translateY = "-50%";
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
