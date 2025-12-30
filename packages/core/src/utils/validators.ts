import type { Beacon, Position, Animation } from "../types";

const VALID_POSITIONS: Position[] = [
  "top-left",
  "top-center",
  "top-right",
  "right-center",
  "bottom-right",
  "bottom-center",
  "bottom-left",
  "left-center",
];

const VALID_ANIMATIONS: Animation[] = [
  "slide-down",
  "slide-up",
  "slide-left",
  "slide-right",
  "fade-in",
  "fade-out",
  "shrink",
  "grow",
  "scale",
  "none",
];

export function isValidPosition(position: unknown): position is Position {
  return VALID_POSITIONS.includes(position as Position);
}

export function isValidAnimation(animation: unknown): animation is Animation {
  return VALID_ANIMATIONS.includes(animation as Animation);
}

export function validateBeacon<TNode = unknown>(
  beacon: Beacon<TNode>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!beacon.id) {
    errors.push("Beacon must have an id");
  }

  if (!beacon.selector) {
    errors.push("Beacon must have a selector");
  }

  if (beacon.position && !isValidPosition(beacon.position)) {
    errors.push(`Invalid position: ${beacon.position}`);
  }

  // if (beacon.animations && !isValidAnimation(beacon.animation)) {
  //   errors.push(`Invalid animation: ${beacon.animations}`);
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
}
