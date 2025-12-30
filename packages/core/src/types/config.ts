import type { DefaultAnimations } from "./animations";
import type { Beacon } from "./beacon";
import type { Position } from "./position";
import type { BeaconStore } from "./store";

export interface Page<TNode = unknown> {
  id: string;
  path: string | RegExp | ((pathname: string) => boolean);
  beacons: Beacon<TNode>[];
}

export interface ErrorHandling {
  onSelectorNotFound?: (beaconId: string, selector: string) => void;
  onRenderError?: (beaconId: string, error: Error) => void;
}

export interface RepereConfig<TNode = unknown> {
  pages: Page<TNode>[];

  // Store for persistence
  store?: BeaconStore;

  defaultPosition?: Position;
  defaultZIndex?: number;

  // Default animations
  animations?: DefaultAnimations;

  // Error handling
  errorHandling?: ErrorHandling;
}
