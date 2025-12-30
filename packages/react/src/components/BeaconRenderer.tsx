import type { Beacon, BeaconStore, Position } from "@repere/core";
import {
  DEFAULT_POSITION,
  getAnimationConfig,
  mergeAnimationConfigs,
} from "@repere/core";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  useId,
  useMemo,
  useRef,
} from "react";
import {
  BeaconContext,
  type BeaconContextValue,
} from "../context/BeaconContext";
import { useBeaconPosition } from "../hooks/useBeaconPosition";
import type { RepereReactConfig } from "../types";

interface BeaconRendererProps {
  beacon: Beacon;
  config: RepereReactConfig;
  store: BeaconStore;
  onDismiss: () => void;
  debug?: boolean;
}

export function BeaconRenderer({
  beacon,
  config,
  store,
  onDismiss,
  debug,
}: BeaconRendererProps) {
  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);

  const position: Position =
    beacon.position || config.defaultPosition || DEFAULT_POSITION;
  const zIndex = beacon.zIndex || config.defaultZIndex || 9999;

  // Calculate position for the trigger
  const { calculatedPosition, targetElement } = useBeaconPosition({
    targetSelector: beacon.target,
    position,
    offset: beacon.offset,
    zIndex,
    enabled: true,
    debug,
  });

  // Resolve animations
  const triggerAnimationConfig = useMemo(() => {
    const rootTriggerAnim = config.animations?.trigger?.onRender;
    const beaconTriggerAnim = beacon.animations?.trigger?.onRender;
    const merged = mergeAnimationConfigs(
      rootTriggerAnim as any,
      beaconTriggerAnim as any,
    );
    return getAnimationConfig(merged);
  }, [config.animations, beacon.animations]);

  const popoverAnimationConfig = useMemo(() => {
    const rootPopoverAnim = config.animations?.popover?.onOpen;
    const beaconPopoverAnim = beacon.animations?.popover?.onOpen;
    const merged = mergeAnimationConfigs(
      rootPopoverAnim as any,
      beaconPopoverAnim as any,
    );
    return getAnimationConfig(merged);
  }, [config.animations, beacon.animations]);

  // Actions - browser handles toggle/open/close via Popover API
  const handleDismiss = async () => {
    await Promise.resolve(store.dismiss(beacon.id));
    onDismiss();
  };

  // Context value
  const contextValue: BeaconContextValue = {
    beaconId: beacon.id,
    position,
    calculatedPosition,
    dismiss: handleDismiss,
    triggerAnimation: triggerAnimationConfig,
    popoverAnimation: popoverAnimationConfig,
    popoverId,
  };

  // Get components from config
  const triggerSource =
    beacon.triggerComponent || config.beaconTriggerComponent;
  const popoverSource =
    beacon.popoverComponent || config.beaconPopoverComponent;

  // Don't render if position not calculated yet
  if (!calculatedPosition || !targetElement) {
    if (debug) {
      console.warn(
        `[Repere] ${beacon.id} waiting for target element: position=${!!calculatedPosition}, element=${!!targetElement}`,
      );
    }
    return null;
  }

  // Popover is required
  if (!popoverSource) {
    if (debug) {
      console.warn(
        "[Repere] No popoverComponent provided for beacon:",
        beacon.id,
      );
    }
    return null;
  }

  // Render trigger
  const renderTrigger = () => {
    if (!triggerSource) return null;

    if (isValidElement(triggerSource)) {
      return triggerSource;
    }

    const TriggerComponent = triggerSource as React.ComponentType<any>;
    return (
      <TriggerComponent
        beacon={beacon}
        style={calculatedPosition}
        position={position}
        isOpen={false}
      />
    );
  };

  // Render popover with Popover API
  const renderPopover = () => {
    if (!popoverSource) return null;

    if (isValidElement(popoverSource)) {
      // Clone the element to add popover attributes
      return cloneElement(popoverSource as ReactElement<any>, {
        ref: popoverRef,
        id: popoverId,
        popover: "auto",
      });
    }

    const PopoverComponent = popoverSource as React.ComponentType<any>;
    return (
      <div ref={popoverRef} id={popoverId} popover="auto">
        <PopoverComponent
          beacon={beacon}
          position={position}
          onDismiss={handleDismiss}
        />
      </div>
    );
  };

  return (
    <BeaconContext.Provider value={contextValue}>
      {renderTrigger()}
      {renderPopover()}
    </BeaconContext.Provider>
  );
}
