import type { CalculatedBeaconPosition, Offset } from "../types/beacon";
import type { Position } from "../types/position";
import { calculateBeaconPosition } from "./positioning";

export type PositionCallback = (
  position: CalculatedBeaconPosition | null,
) => void;

interface TrackedElement {
  selector: string;
  position: Position;
  offset?: Offset;
  zIndex: number;
  delay?: number;
  callbacks: Set<PositionCallback>;
  element: HTMLElement | null;
  hasInitialUpdate: boolean;
  delayTimeoutId?: ReturnType<typeof setTimeout>; // Track timeout for cleanup
}

/**
 * Framework-agnostic position tracker for beacon elements
 * Tracks element positions and notifies subscribers of changes
 */
export class PositionTracker {
  private tracked = new Map<string, TrackedElement>();
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private debug = false;

  constructor(debug = false) {
    this.debug = debug;
  }

  /**
   * Subscribe to position updates for an element
   */
  subscribe(
    selector: string,
    position: Position,
    callback: PositionCallback,
    options: {
      offset?: Offset;
      zIndex?: number;
      delay?: number;
    } = {},
  ): () => void {
    const key = selector;

    if (!this.tracked.has(key)) {
      this.tracked.set(key, {
        selector,
        position,
        offset: options.offset,
        zIndex: options.zIndex ?? 9999,
        delay: options.delay,
        callbacks: new Set(),
        element: null,
        hasInitialUpdate: false,
      });
    }

    const tracked = this.tracked.get(key);
    tracked?.callbacks.add(callback);

    // Start listeners if this is the first subscription
    if (this.tracked.size === 1) {
      this.startListening();
    }

    // Calculate initial position (with delay if specified)
    this.scheduleInitialUpdate(key);

    // Return unsubscribe function
    return () => {
      const tracked = this.tracked.get(key);
      if (tracked) {
        tracked.callbacks.delete(callback);

        // Clean up if no more callbacks
        if (tracked.callbacks.size === 0) {
          // Clear any pending timeout before removing
          if (tracked.delayTimeoutId !== undefined) {
            clearTimeout(tracked.delayTimeoutId);
            tracked.delayTimeoutId = undefined;
          }

          this.tracked.delete(key);

          // Stop listeners if no more tracked elements
          if (this.tracked.size === 0) {
            this.stopListening();
          }
        }
      }
    };
  }

  private scheduleInitialUpdate(key: string) {
    const tracked = this.tracked.get(key);
    if (!tracked) return;

    if (!tracked.hasInitialUpdate && tracked.delay && tracked.delay > 0) {
      // Mark as having an initial update scheduled
      tracked.hasInitialUpdate = true;

      if (this.debug) {
        console.log(
          `[PositionTracker] Delaying initial position calculation for ${key} by ${tracked.delay}ms`,
        );
      }

      // Schedule the update after the delay and store the timeout ID
      tracked.delayTimeoutId = setTimeout(() => {
        if (this.debug) {
          console.log(
            `[PositionTracker] Calculating position for ${key} after delay`,
          );
        }
        // Clear the timeout ID since it has completed
        if (tracked.delayTimeoutId !== undefined) {
          tracked.delayTimeoutId = undefined;
        }
        this.updatePosition(key);
      }, tracked.delay);
    } else {
      // No delay, update immediately
      if (!tracked.hasInitialUpdate) {
        tracked.hasInitialUpdate = true;
      }
      this.updatePosition(key);
    }
  }

  private updatePosition(key: string) {
    const tracked = this.tracked.get(key);
    if (!tracked) return;

    const element = document.querySelector(tracked.selector) as HTMLElement;

    if (!element) {
      if (this.debug) {
        console.log(`[PositionTracker] Element not found: ${tracked.selector}`);
      }
      tracked.element = null;
      for (const cb of tracked.callbacks) {
        cb(null);
      }
      return;
    }

    tracked.element = element;
    const rect = element.getBoundingClientRect();
    const coords = calculateBeaconPosition(
      rect,
      tracked.position,
      tracked.offset,
    );

    const calculatedPosition: CalculatedBeaconPosition = {
      ...coords,
      position: "fixed" as const,
      zIndex: tracked.zIndex,
    };

    if (this.debug) {
      console.log(
        `[PositionTracker] Updated position for ${tracked.selector}:`,
        calculatedPosition,
      );
    }

    for (const cb of tracked.callbacks) {
      cb(calculatedPosition);
    }
  }

  private updateAllPositions = () => {
    for (const [key] of this.tracked) {
      this.updatePosition(key);
    }
  };

  private startListening() {
    // Scroll listener
    this.scrollListener = this.updateAllPositions;
    window.addEventListener("scroll", this.scrollListener, true);

    // Resize listener
    this.resizeListener = this.updateAllPositions;
    window.addEventListener("resize", this.resizeListener);

    // ResizeObserver for element resize
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this.updateAllPositions);
    }

    // MutationObserver for DOM changes
    this.mutationObserver = new MutationObserver(() => {
      this.updateAllPositions();
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
      if (tracked.delayTimeoutId !== undefined) {
        clearTimeout(tracked.delayTimeoutId);
        tracked.delayTimeoutId = undefined;
      }
    }

    this.stopListening();
    this.tracked.clear();
  }
}
