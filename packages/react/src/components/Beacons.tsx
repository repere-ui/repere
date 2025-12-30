import { MemoryStore, matchPath } from "@repere/core";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { RepereReactConfig } from "../types";
import { BeaconRenderer } from "./BeaconRenderer";

// Inject CSS anchor positioning styles once globally
let anchorStylesInjected = false;
function injectAnchorStyles() {
  if (anchorStylesInjected || typeof document === "undefined") return;

  const styleId = "repere-anchor-styles";
  if (document.getElementById(styleId)) {
    anchorStylesInjected = true;
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
      /* Anchor positioning for Repere popovers */
      /* Note: anchor-name is set inline per trigger via style.anchorName */
      [data-repere-popover]:popover-open {
        position: absolute;
        /* position-anchor is set inline per popover */
        inset: unset;
        margin: 0;

        /* Default: bottom-center */
        top: anchor(bottom);
        left: anchor(center);
        translate: -50% 0;

        /* Position try fallbacks for viewport overflow */
        position-try-options: --bottom-left, --bottom-right, --top-center, --top-left, --top-right;
      }

      @position-try --bottom-left {
        inset: unset;
        top: anchor(bottom);
        left: anchor(left);
        translate: 0 0;
      }

      @position-try --bottom-right {
        inset: unset;
        top: anchor(bottom);
        right: anchor(right);
        translate: 0 0;
      }

      @position-try --top-center {
        inset: unset;
        bottom: anchor(top);
        left: anchor(center);
        translate: -50% 0;
      }

      @position-try --top-left {
        inset: unset;
        bottom: anchor(top);
        left: anchor(left);
        translate: 0 0;
      }

      @position-try --top-right {
        inset: unset;
        bottom: anchor(top);
        right: anchor(right);
        translate: 0 0;
      }
    `;

  document.head.appendChild(style);
  anchorStylesInjected = true;
}

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

  useEffect(() => {
    injectAnchorStyles();
  }, []);

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
