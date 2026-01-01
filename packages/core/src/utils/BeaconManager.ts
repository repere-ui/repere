import type { Beacon } from "../types/beacon";
import type { Page } from "../types/config";
import type { BeaconStore } from "../types/store";
import { matchPath } from "./path-matching";

export interface BeaconManagerOptions {
  debug?: boolean;
}

/**
 * Framework-agnostic beacon lifecycle manager
 * Handles page matching and beacon filtering
 */
export class BeaconManager<TComponent = unknown> {
  private readonly store: BeaconStore;
  private readonly debug: boolean;

  constructor(store: BeaconStore, options: BeaconManagerOptions = {}) {
    this.store = store;
    this.debug = options.debug ?? false;
  }

  /**
   * Find the page that matches the current path
   */
  findMatchingPage(
    pages: Page<TComponent>[],
    currentPath: string,
  ): Page<TComponent> | null {
    const match = pages.find((page) => {
      if (typeof page.path === "function") {
        return page.path(currentPath);
      }
      return matchPath(currentPath, page.path);
    });

    if (this.debug) {
      console.log(
        "[BeaconManager] Path:",
        currentPath,
        "Matched:",
        match?.id || "none",
      );
    }

    return match || null;
  }

  /**
   * Get all active (non-dismissed) beacons for the current path
   */
  async getActiveBeacons(
    pages: Page<TComponent>[],
    currentPath: string,
  ): Promise<Beacon<TComponent>[]> {
    const page = this.findMatchingPage(pages, currentPath);

    if (!page) {
      if (this.debug) {
        console.log("[BeaconManager] No matching page found");
      }
      return [];
    }

    if (this.debug) {
      console.log(
        "[BeaconManager] Found page:",
        page.id,
        "with",
        page.beacons.length,
        "beacons",
      );
    }

    // Filter out dismissed beacons
    const activeBeacons: Beacon<TComponent>[] = [];

    for (const beacon of page.beacons) {
      const isDismissed = await Promise.resolve(
        this.store.isDismissed(beacon.id),
      );

      if (!isDismissed) {
        activeBeacons.push(beacon);
      } else if (this.debug) {
        console.log("[BeaconManager] Beacon", beacon.id, "is dismissed");
      }
    }

    if (this.debug) {
      console.log("[BeaconManager] Active beacons:", activeBeacons.length);
    }

    return activeBeacons;
  }

  /**
   * Get the store instance
   */
  getStore(): BeaconStore {
    return this.store;
  }
}
