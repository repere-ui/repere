import type {
  CalculatedBeaconPosition,
  Offset,
  Position,
  ResolvedAnimationConfig,
} from "@repere/core";
import { createContext, useContext } from "react";

export interface RepereContextValue {
  beaconId: string;
  position: Position;
  popoverPosition?: Position;
  popoverOffset?: Offset;
  calculatedPosition: CalculatedBeaconPosition | null;
  isOpen: boolean;
  isDismissing: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  dismiss: () => void;
  triggerAnimation: ResolvedAnimationConfig | null;
  triggerDismissAnimation: ResolvedAnimationConfig | null;
  popoverOpenAnimation: ResolvedAnimationConfig | null;
  popoverCloseAnimation: ResolvedAnimationConfig | null;
  popoverId?: string;
}

export const RepereContext = createContext<RepereContextValue | null>(null);

export function useRepereContext(): RepereContextValue {
  const context = useContext(RepereContext);
  if (!context) {
    throw new Error("useRepereContext must be used within a Repere provider.");
  }
  return context;
}
