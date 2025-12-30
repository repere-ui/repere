import type { CalculatedBeaconPosition, Position } from "@repere/core";
import { createContext, useContext } from "react";

export interface BeaconContextValue {
  // Beacon identity
  beaconId: string;

  // Position data
  position: Position;
  calculatedPosition: CalculatedBeaconPosition | null;

  // UI state
  isOpen: boolean;

  // Actions
  toggle: () => void;
  open: () => void;
  close: () => void;
  dismiss: () => void;

  // Animation configs (resolved from core)
  triggerAnimation?: any;
  popoverAnimation?: any;

  popoverId: string;
}

export const BeaconContext = createContext<BeaconContextValue | null>(null);

export function useBeaconContext(): BeaconContextValue {
  const context = useContext(BeaconContext);
  if (!context) {
    throw new Error(
      "useBeaconContext must be used within a Beacon provider. " +
        "This is an internal error - beacons should be rendered via useRepere().",
    );
  }
  return context;
}
