import type {
  AnchorPoint,
  CalculatedBeaconAnchorPoint,
  Offset,
  ResolvedAnimationConfig,
} from "@repere/core";
import { createContext, useContext } from "react";

export interface RepereContextValue {
  beaconId: string;
  anchorPoint: AnchorPoint;
  popoverAnchorPoint?: AnchorPoint;
  popoverOffset?: Offset;
  calculatedAnchorPoint: CalculatedBeaconAnchorPoint | null;
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
  popoverId: string;
}

export const RepereContext = createContext<RepereContextValue | null>(null);

export function useRepereContext() {
  const context = useContext(RepereContext);
  if (!context) {
    throw new Error("useRepereContext must be used within RepereProvider");
  }
  return context;
}
