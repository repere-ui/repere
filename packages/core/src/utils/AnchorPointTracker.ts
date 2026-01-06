import type { AnchorPoint } from "../types/anchors";
import type {
  CalculatedBeaconAnchorPoint,
  Offset,
  PositioningStrategy,
} from "../types/beacon";
import { PositioningStrategy as PS } from "../types/beacon";
import { calculateAnchorPointCoords } from "./positioning";

export type AnchorPointCallback = (
  anchorPoint: CalculatedBeaconAnchorPoint | null,
) => void;

interface CallbackInfo {
  callback: AnchorPointCallback;
  needsInitialDelay: boolean;
}

interface TrackedElement {
  selector: string;
  anchorPoint: AnchorPoint;
  offset?: Offset;
  zIndex: number;
  delay?: number;
  positioningStrategy: PositioningStrategy;
  callbacks: Map<AnchorPointCallback, CallbackInfo>;
  element: HTMLElement | null;
  delayTimeoutIds: Map<AnchorPointCallback, ReturnType<typeof setTimeout>>;
}

/**
 * Framework-agnostic anchor point tracker for beacon elements
 * Tracks element anchor points and notifies subscribers of changes
 */
export class AnchorPointTracker {
  private tracked = new Map<string, TrackedElement>();
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private updateScheduled = false;
  private debug = false;

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Subscribe to anchor point updates for an element
   */
  subscribe(
    selector: string,
    anchorPoint: AnchorPoint,
    callback: AnchorPointCallback,
    options: {
      offset?: Offset;
      zIndex?: number;
      delay?: number;
      positioningStrategy?: PositioningStrategy;
    } = {},
  ): () => void {
    const strategy = options.positioningStrategy ?? PS.Absolute;

    // Delegate to appropriate strategy
    if (strategy === PS.Absolute) {
      return this.subscribeAbsolute(selector, anchorPoint, callback, options);
    } else {
      return this.subscribeFixed(selector, anchorPoint, callback, options);
    }
  }

  /**
   * Subscribe with absolute positioning strategy (no tracking)
   */
  private subscribeAbsolute(
    selector: string,
    anchorPoint: AnchorPoint,
    callback: AnchorPointCallback,
    options: {
      offset?: Offset;
      zIndex?: number;
      delay?: number;
    },
  ): () => void {
    const { offset, zIndex = 9999, delay = 0 } = options;

    const calculateAndNotify = () => {
      const element = document.querySelector(selector) as HTMLElement;

      if (!element) {
        if (this.debug) {
          console.log(
            `[AnchorPointTracker:Absolute] Element not found: ${selector}`,
          );
        }
        callback(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      const coords = calculateAnchorPointCoords(rect, anchorPoint, offset);

      const calculatedAnchorPoint: CalculatedBeaconAnchorPoint = {
        ...coords,
        position: "absolute" as const,
        zIndex,
      };

      if (this.debug) {
        console.log(
          `[AnchorPointTracker:Absolute] Calculated anchor point for ${selector}:`,
          calculatedAnchorPoint,
        );
      }

      callback(calculatedAnchorPoint);
    };

    // Calculate with optional delay
    if (delay > 0) {
      if (this.debug) {
        console.log(
          `[AnchorPointTracker:Absolute] Delaying calculation for ${selector} by ${delay}ms`,
        );
      }
      const timeoutId = setTimeout(calculateAndNotify, delay);
      return () => clearTimeout(timeoutId);
    } else {
      calculateAndNotify();
      return () => {}; // No cleanup needed for absolute strategy
    }
  }

  /**
   * Subscribe with fixed positioning strategy (with tracking)
   */
  private subscribeFixed(
    selector: string,
    anchorPoint: AnchorPoint,
    callback: AnchorPointCallback,
    options: {
      offset?: Offset;
      zIndex?: number;
      delay?: number;
    },
  ): () => void {
    const key = selector;

    if (!this.tracked.has(key)) {
      this.tracked.set(key, {
        selector,
        anchorPoint,
        offset: options.offset,
        zIndex: options.zIndex ?? 9999,
        delay: options.delay,
        positioningStrategy: PS.Fixed,
        callbacks: new Map(),
        element: null,
        delayTimeoutIds: new Map(),
      });
    }

    const tracked = this.tracked.get(key);
    if (!tracked) return () => {};

    // Add callback with delay flag
    tracked.callbacks.set(callback, {
      callback,
      needsInitialDelay: (options.delay ?? 0) > 0,
    });

    // Start listeners if this is the first subscription
    if (this.tracked.size === 1) {
      this.startListening();
    }

    // Calculate initial anchor point (with delay if specified for this callback)
    this.scheduleInitialUpdate(key, callback);

    // Return unsubscribe function
    return () => {
      const tracked = this.tracked.get(key);
      if (tracked) {
        // Clear any pending timeout for this specific callback
        const timeoutId = tracked.delayTimeoutIds.get(callback);
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
          tracked.delayTimeoutIds.delete(callback);
        }

        tracked.callbacks.delete(callback);

        // Clean up if no more callbacks
        if (tracked.callbacks.size === 0) {
          // Clear all remaining timeouts
          for (const [, timeoutId] of tracked.delayTimeoutIds) {
            clearTimeout(timeoutId);
          }
          tracked.delayTimeoutIds.clear();

          this.tracked.delete(key);

          // Stop listeners if no more tracked elements
          if (this.tracked.size === 0) {
            this.stopListening();
          }
        }
      }
    };
  }

  private scheduleInitialUpdate(key: string, callback: AnchorPointCallback) {
    const tracked = this.tracked.get(key);
    if (!tracked) return;

    const callbackInfo = tracked.callbacks.get(callback);
    if (!callbackInfo) return;

    if (callbackInfo.needsInitialDelay && tracked.delay && tracked.delay > 0) {
      if (this.debug) {
        console.log(
          `[AnchorPointTracker:Fixed] Delaying initial anchor point calculation for ${key} by ${tracked.delay}ms`,
        );
      }

      // Schedule the update after the delay for this specific callback
      const timeoutId = setTimeout(() => {
        if (this.debug) {
          console.log(
            `[AnchorPointTracker:Fixed] Calculating anchor point for ${key} after delay`,
          );
        }

        // Mark this callback as no longer needing delay
        const info = tracked.callbacks.get(callback);
        if (info) {
          info.needsInitialDelay = false;
        }

        // Clear the timeout ID
        tracked.delayTimeoutIds.delete(callback);

        // Update anchor point for this callback
        this.updateAnchorPointForCallback(key, callback);
      }, tracked.delay);

      tracked.delayTimeoutIds.set(callback, timeoutId);
    } else {
      // No delay, update immediately
      this.updateAnchorPointForCallback(key, callback);
    }
  }

  private updateAnchorPointForCallback(
    key: string,
    callback: AnchorPointCallback,
  ) {
    const tracked = this.tracked.get(key);
    if (!tracked) return;

    const element = document.querySelector(tracked.selector) as HTMLElement;

    if (!element) {
      if (this.debug) {
        console.log(
          `[AnchorPointTracker:Fixed] Element not found: ${tracked.selector}`,
        );
      }
      tracked.element = null;
      callback(null);
      return;
    }

    tracked.element = element;
    const rect = element.getBoundingClientRect();
    const coords = calculateAnchorPointCoords(
      rect,
      tracked.anchorPoint,
      tracked.offset,
    );

    const calculatedAnchorPoint: CalculatedBeaconAnchorPoint = {
      ...coords,
      position: "fixed" as const,
      zIndex: tracked.zIndex,
    };

    if (this.debug) {
      console.log(
        `[AnchorPointTracker:Fixed] Updated anchor point for ${tracked.selector}:`,
        calculatedAnchorPoint,
      );
    }

    callback(calculatedAnchorPoint);
  }

  private updateAnchorPoint(key: string) {
    const tracked = this.tracked.get(key);
    if (!tracked) return;

    const element = document.querySelector(tracked.selector) as HTMLElement;

    if (!element) {
      if (this.debug) {
        console.log(
          `[AnchorPointTracker:Fixed] Element not found: ${tracked.selector}`,
        );
      }
      tracked.element = null;
      // Only notify callbacks that have completed their initial delay
      for (const [callback, info] of tracked.callbacks) {
        if (!info.needsInitialDelay) {
          callback(null);
        }
      }
      return;
    }

    tracked.element = element;
    const rect = element.getBoundingClientRect();
    const coords = calculateAnchorPointCoords(
      rect,
      tracked.anchorPoint,
      tracked.offset,
    );

    const calculatedAnchorPoint: CalculatedBeaconAnchorPoint = {
      ...coords,
      position: "fixed" as const,
      zIndex: tracked.zIndex,
    };

    if (this.debug) {
      console.log(
        `[AnchorPointTracker:Fixed] Updated anchor point for ${tracked.selector}:`,
        calculatedAnchorPoint,
      );
    }

    // Only update callbacks that have completed their initial delay
    for (const [callback, info] of tracked.callbacks) {
      if (!info.needsInitialDelay) {
        callback(calculatedAnchorPoint);
      }
    }
  }

  private scheduleUpdate = () => {
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        this.updateAllAnchorPointsSync();
        this.updateScheduled = false;
      });
    }
  };

  private updateAllAnchorPointsSync = () => {
    for (const [key] of this.tracked) {
      this.updateAnchorPoint(key);
    }
  };

  private startListening() {
    // Scroll listener (with RAF batching)
    this.scrollListener = this.scheduleUpdate;
    window.addEventListener("scroll", this.scrollListener, true);

    // Resize listener (with RAF batching)
    this.resizeListener = this.scheduleUpdate;
    window.addEventListener("resize", this.resizeListener);

    // ResizeObserver for element resize
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this.scheduleUpdate);
    }

    // MutationObserver for DOM changes
    this.mutationObserver = new MutationObserver(() => {
      this.scheduleUpdate();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private stopListening() {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = null;
    }

    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = null;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.mutationObserver?.disconnect();
    this.mutationObserver = null;
  }

  /**
   * Clean up all listeners and subscriptions
   */
  destroy() {
    // Clear all pending timeouts
    for (const [, tracked] of this.tracked) {
      for (const [, timeoutId] of tracked.delayTimeoutIds) {
        clearTimeout(timeoutId);
      }
      tracked.delayTimeoutIds.clear();
    }

    this.stopListening();
    this.tracked.clear();
  }
}
