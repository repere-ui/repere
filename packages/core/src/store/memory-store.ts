import type { BeaconState, BeaconStore } from "../types/store";

export class MemoryStore implements BeaconStore {
  private state: Map<string, BeaconState> = new Map();

  isDismissed(beaconId: string): boolean {
    const beacon = this.state.get(beaconId);
    return beacon?.isDismissed ?? false;
  }

  dismiss(beaconId: string): void {
    const existing = this.state.get(beaconId);
    this.state.set(beaconId, {
      id: beaconId,
      isDismissed: true,
      dismissedAt: Date.now(),
      viewCount: (existing?.viewCount ?? 0) + 1,
      lastViewedAt: Date.now(),
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

  // Helper for tracking views without dismissing
  incrementViewCount(beaconId: string): void {
    const existing = this.state.get(beaconId);
    this.state.set(beaconId, {
      ...existing,
      id: beaconId,
      isDismissed: existing?.isDismissed ?? false,
      viewCount: (existing?.viewCount ?? 0) + 1,
      lastViewedAt: Date.now(),
    });
  }
}
