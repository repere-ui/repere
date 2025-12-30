export interface BeaconState {
  id: string;
  isDismissed: boolean;
}

export interface BeaconStore {
  // Check if a beacon is dismissed
  isDismissed(beaconId: BeaconState["id"]): Promise<boolean> | boolean;

  // Mark a beacon as dismissed
  dismiss(beaconId: BeaconState["id"]): Promise<void> | void;

  // Reset a beacon's dismissed state
  reset(beaconId: BeaconState["id"]): Promise<void> | void;

  // Reset all beacons
  resetAll(): Promise<void> | void;

  // Get all beacon states
  getAll(): Promise<BeaconState[]> | BeaconState[];
}
