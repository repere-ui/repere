// Main component
export { Beacons, type BeaconsProps } from "./components/Beacons";
// UI Components
export { ReperePopover } from "./components/Popover";
export { RepereTrigger } from "./components/RepereTrigger";
// Context
export {
  BeaconContext,
  type BeaconContextValue,
  useBeaconContext,
} from "./context/BeaconContext";
// Hooks
export { useBeaconPosition } from "./hooks/useBeaconPosition";
export { useBeaconStore } from "./hooks/useBeaconStore";
// Re-export React types
export type {
  PopoverComponent,
  PopoverComponentProps,
  ReactBeacon,
  ReactPage,
  RepereReactConfig,
  TriggerComponent,
  TriggerComponentProps,
} from "./types";
