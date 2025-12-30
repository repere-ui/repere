import type { Position } from "../types/position";

export interface PositionOffset {
  x?: number;
  y?: number;
}

export interface PositionCoordinates {
  top: number;
  left: number;
  transform: string;
}

/**
 * Calculate beacon position relative to target element
 */
export function calculateBeaconPosition(
  targetRect: DOMRect,
  position: Position = "top-right",
  offset: PositionOffset = { x: 0, y: 0 },
): PositionCoordinates {
  const { x: offsetX = 0, y: offsetY = 0 } = offset;
  let top = 0;
  let left = 0;
  let transform = "";

  switch (position) {
    // Top positions
    case "top-left":
      top = targetRect.top + window.scrollY;
      left = targetRect.left + window.scrollX;
      transform = "translate(-50%, -100%)";
      break;
    case "top-center":
      top = targetRect.top + window.scrollY;
      left = targetRect.left + window.scrollX + targetRect.width / 2;
      transform = "translate(-50%, -100%)";
      break;
    case "top-right":
      top = targetRect.top + window.scrollY;
      left = targetRect.right + window.scrollX;
      transform = "translate(-50%, -100%)";
      break;

    // Right positions
    case "right-center":
      top = targetRect.top + window.scrollY + targetRect.height / 2;
      left = targetRect.right + window.scrollX;
      transform = "translate(0%, -50%)";
      break;

    // Bottom positions
    case "bottom-left":
      top = targetRect.bottom + window.scrollY;
      left = targetRect.left + window.scrollX;
      transform = "translate(-50%, 0%)";
      break;
    case "bottom-center":
      top = targetRect.bottom + window.scrollY;
      left = targetRect.left + window.scrollX + targetRect.width / 2;
      transform = "translate(-50%, 0%)";
      break;
    case "bottom-right":
      top = targetRect.bottom + window.scrollY;
      left = targetRect.right + window.scrollX;
      transform = "translate(-50%, 0%)";
      break;

    // Left positions
    case "left-center":
      top = targetRect.top + window.scrollY + targetRect.height / 2;
      left = targetRect.left + window.scrollX;
      transform = "translate(-100%, -50%)";
      break;
  }

  // Apply offsets
  top += offsetY;
  left += offsetX;

  return { top, left, transform };
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
