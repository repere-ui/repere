import type { CalculatedBeaconPosition, Offset, Position } from "@repere/core";
import { createContext, useContext } from "react";

export interface BeaconContextValue {
  beaconId: string;
  position: Position; // Trigger position
  popoverPosition?: Position; // Popover position
  popoverOffset?: Offset;
  calculatedPosition: CalculatedBeaconPosition | null;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  dismiss: () => void;
  triggerAnimation: any;
  popoverAnimation: any;
  popoverId?: string;
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
