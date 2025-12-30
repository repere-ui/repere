import type { BeaconState, BeaconStore } from "../types/store";

export class MemoryStore implements BeaconStore {
  private state: Map<string, BeaconState> = new Map();

  isDismissed(beaconId: string): boolean {
    const beacon = this.state.get(beaconId);
    return beacon?.isDismissed ?? false;
  }

  dismiss(beaconId: string): void {
    this.state.set(beaconId, {
      id: beaconId,
      isDismissed: true,
    });
  }

  reset(beaconId: string): void {
    this.state.delete(beaconId);
  }

  resetAll(): void {
    this.state.clear();
  }

  getAll(): BeaconState[] {
    return Array.from(this.state.values());
  }
}
