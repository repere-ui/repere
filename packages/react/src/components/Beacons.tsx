import { BeaconManager, MemoryStore } from "@repere/core";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactBeacon, ReactComponent, RepereReactConfig } from "../types";
import { RepereProvider } from "./RepereProvider";

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

  // Create beacon manager with ReactComponent type
  const beaconManager = useMemo(
    () => new BeaconManager<ReactComponent>(store, { debug }),
    [store, debug],
  );

  // Track active beacons for current path
  const [activeBeacons, setActiveBeacons] = useState<ReactBeacon[]>([]);

  // Track dismissed beacons (for optimistic UI updates)
  const [dismissedBeacons, setDismissedBeacons] = useState<Set<string>>(
    new Set(),
  );

  // Load active beacons when path or enabled state changes
  useEffect(() => {
    if (!enabled) {
      setActiveBeacons([]);
      setDismissedBeacons(new Set());
      return;
    }

    const loadActiveBeacons = async () => {
      const beacons = await beaconManager.getActiveBeacons(
        config.pages,
        currentPath,
      );
      setActiveBeacons(beacons as ReactBeacon[]);
    };

    loadActiveBeacons();
  }, [beaconManager, config.pages, currentPath, enabled]);

  const handleDismiss = (beaconId: string) => {
    // Optimistically update UI
    setDismissedBeacons((prev) => new Set([...prev, beaconId]));
  };

  // Filter out beacons that were dismissed in this session (optimistic update)
  const beaconsToRender = activeBeacons.filter(
    (beacon) => !dismissedBeacons.has(beacon.id),
  );

  if (beaconsToRender.length === 0) {
    return null;
  }

  return createPortal(
    beaconsToRender.map((beacon) => (
      <RepereProvider
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
