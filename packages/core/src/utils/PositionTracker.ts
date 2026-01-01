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
  callbacks: Set<PositionCallback>;
  element: HTMLElement | null;
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
    } = {},
  ): () => void {
    const key = selector;

    if (!this.tracked.has(key)) {
      this.tracked.set(key, {
        selector,
        position,
        offset: options.offset,
        zIndex: options.zIndex ?? 9999,
        callbacks: new Set(),
        element: null,
      });
    }

    const tracked = this.tracked.get(key)!;
    tracked.callbacks.add(callback);

    // Start listeners if this is the first subscription
    if (this.tracked.size === 1) {
      this.startListening();
    }

    // Calculate initial position
    this.updatePosition(key);

    // Return unsubscribe function
    return () => {
      const tracked = this.tracked.get(key);
      if (tracked) {
        tracked.callbacks.delete(callback);

        // Clean up if no more callbacks
        if (tracked.callbacks.size === 0) {
          this.tracked.delete(key);

          // Stop listeners if no more tracked elements
          if (this.tracked.size === 0) {
            this.stopListening();
          }
        }
      }
    };
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
      tracked.callbacks.forEach((cb) => cb(null));
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

    tracked.callbacks.forEach((cb) => cb(calculatedPosition));
  }

  private updateAllPositions = () => {
    this.tracked.forEach((_, key) => this.updatePosition(key));
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
    this.stopListening();
    this.tracked.clear();
  }
}
