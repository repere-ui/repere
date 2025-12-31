import type { Beacon, PopoverConfig, TriggerConfig } from "./beacon";
import type { BeaconStore } from "./store";

export interface Page<TNode = unknown> {
  id: string;
  path: string | ((pathname: string) => boolean);
  beacons: Beacon<TNode>[];
}

export interface ErrorHandling {
  onRenderError?: (beaconId: string, error: Error) => void;
  onPositionError?: (beaconId: string, error: Error) => void;
}

export interface RepereConfig<TNode = unknown> {
  pages: Page<TNode>[];
  store?: BeaconStore;
  trigger?: TriggerConfig<TNode>;
  popover?: PopoverConfig<TNode>;
  errorHandling?: ErrorHandling;
}
