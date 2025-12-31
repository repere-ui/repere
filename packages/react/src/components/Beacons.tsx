import { MemoryStore, matchPath } from "@repere/core";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { RepereReactConfig } from "../types";
import { BeaconRenderer } from "./BeaconRenderer";

export interface BeaconsProps {
  config: RepereReactConfig;
  /**
   * Current pathname from your router
   */
  currentPath: string;
  enabled?: boolean;
  debug?: boolean;
}

export function Beacons({
  config,
  currentPath,
  enabled = true,
  debug = false,
}: BeaconsProps) {
  const store = useMemo(
    () => config.store || new MemoryStore(),
    [config.store],
  );

  // Find matching page
  const matchingPage = useMemo(() => {
    if (!enabled) return null;

    const match = config.pages.find((page) => {
      if (typeof page.path === "function") {
        return page.path(currentPath);
      }
      return matchPath(currentPath, page.path);
    });

    if (debug) {
      console.log("[Repere] Path:", currentPath, "Matched:", match?.id);
    }

    return match;
  }, [config.pages, currentPath, enabled, debug]);

  // Track dismissed beacons
  const [dismissedBeacons, setDismissedBeacons] = useState<Set<string>>(
    new Set(),
  );

  // Load dismissed state when page changes
  useEffect(() => {
    if (!matchingPage) {
      setDismissedBeacons(new Set());
      return;
    }

    const loadDismissed = async () => {
      const dismissed = new Set<string>();

      for (const beacon of matchingPage.beacons) {
        const isDismissed = await Promise.resolve(store.isDismissed(beacon.id));
        if (isDismissed) {
          dismissed.add(beacon.id);
        }
      }

      setDismissedBeacons(dismissed);
    };

    loadDismissed();
  }, [matchingPage, store]);

  const handleDismiss = (beaconId: string) => {
    setDismissedBeacons((prev) => new Set([...prev, beaconId]));
  };

  // Filter beacons
  const beaconsToRender =
    matchingPage?.beacons.filter(
      (beacon) => !dismissedBeacons.has(beacon.id),
    ) || [];

  if (beaconsToRender.length === 0) {
    return null;
  }

  return createPortal(
    beaconsToRender.map((beacon) => (
      <BeaconRenderer
        key={beacon.id}
        beacon={beacon}
        config={config}
        store={store}
        debug={debug}
        onDismiss={() => handleDismiss(beacon.id)}
      />
    )),
    document.body,
  );
}
