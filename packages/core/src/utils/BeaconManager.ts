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
   * Find all pages that match the current path
   * This supports wildcards - e.g., path="*" will match all pages
   */
  findMatchingPages(
    pages: Page<TComponent>[],
    currentPath: string,
  ): Page<TComponent>[] {
    const matches = pages.filter((page) => {
      if (typeof page.path === "function") {
        return page.path(currentPath);
      }
      return matchPath(currentPath, page.path);
    });

    if (this.debug) {
      console.log(
        "[BeaconManager] Path:",
        currentPath,
        "Matched pages:",
        matches.map((p) => p.id).join(", ") || "none",
      );
    }

    return matches;
  }

  /**
   * Get all active (non-dismissed) beacons for the current path
   * Includes beacons from all matching pages (supports wildcards)
   */
  async getActiveBeacons(
    pages: Page<TComponent>[],
    currentPath: string,
  ): Promise<Beacon<TComponent>[]> {
    // Find ALL matching pages (not just the first one)
    const matchingPages = this.findMatchingPages(pages, currentPath);

    if (matchingPages.length === 0) {
      if (this.debug) {
        console.log("[BeaconManager] No matching pages found");
      }
      return [];
    }

    if (this.debug) {
      console.log(
        "[BeaconManager] Found",
        matchingPages.length,
        "matching page(s):",
        matchingPages.map((p) => p.id).join(", "),
      );
    }

    // Collect beacons from all matching pages
    const allBeacons: Beacon<TComponent>[] = [];
    const seenBeaconIds = new Set<string>();

    for (const page of matchingPages) {
      for (const beacon of page.beacons) {
        // Skip duplicate beacon IDs (if same beacon appears in multiple pages)
        if (seenBeaconIds.has(beacon.id)) {
          if (this.debug) {
            console.warn(
              `[BeaconManager] Duplicate beacon ID "${beacon.id}" in page "${page.id}", skipping`,
            );
          }
          continue;
        }

        seenBeaconIds.add(beacon.id);
        allBeacons.push(beacon);
      }
    }

    // Filter out dismissed beacons
    const activeBeacons: Beacon<TComponent>[] = [];

    for (const beacon of allBeacons) {
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
