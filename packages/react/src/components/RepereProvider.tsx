import type { BeaconStore } from "@repere/core";
import { calculateDismissDuration, waitForAnimations } from "@repere/core";
import { useId, useState } from "react";
import {
  RepereContext,
  type RepereContextValue,
} from "../context/RepereContext";
import { useAnimationConfigs } from "../hooks/useAnimationConfigs";
import { useBeaconPosition } from "../hooks/useBeaconPosition";
import { usePopoverState } from "../hooks/usePopoverState";
import type { ReactBeacon, RepereReactConfig } from "../types";
import {
  renderPopoverComponent,
  renderTriggerComponent,
} from "../utils/renderRepereComponents";
import { resolveBeaconConfig } from "../utils/resolveBeaconConfig";

interface RepereProviderProps {
  beacon: ReactBeacon;
  config: RepereReactConfig;
  store: BeaconStore;
  onDismiss: () => void;
  debug?: boolean;
}

export function RepereProvider({
  beacon,
  config,
  store,
  onDismiss,
  debug,
}: RepereProviderProps) {
  const popoverId = useId();
  const [isDismissing, setIsDismissing] = useState(false);

  // Resolve configuration
  const { position, zIndex, offset, popoverPosition, popoverOffset } =
    resolveBeaconConfig(beacon, config);

  // Calculate position
  const { calculatedPosition, targetElement } = useBeaconPosition({
    targetSelector: beacon.selector,
    position,
    offset,
    zIndex,
    enabled: true,
    debug,
  });

  // Manage popover state
  const {
    isOpen,
    popoverElement,
    handlePopoverRef,
    togglePopover,
    showPopover,
    hidePopover,
  } = usePopoverState();

  // Resolve animations
  const {
    triggerAnimation,
    triggerDismissAnimation,
    popoverOpenAnimation,
    popoverCloseAnimation,
  } = useAnimationConfigs(beacon, config);

  // Handle dismiss
  const handleDismiss = async () => {
    setIsDismissing(true);
    popoverElement?.hidePopover();

    const duration = calculateDismissDuration(
      triggerDismissAnimation,
      popoverCloseAnimation,
    );

    await waitForAnimations(duration);
    await Promise.resolve(store.dismiss(beacon.id));
    onDismiss();
  };

  // Context value
  const contextValue: RepereContextValue = {
    beaconId: beacon.id,
    position,
    popoverPosition,
    popoverOffset,
    calculatedPosition,
    isOpen,
    isDismissing,
    toggle: togglePopover,
    open: showPopover,
    close: hidePopover,
    dismiss: handleDismiss,
    triggerAnimation,
    triggerDismissAnimation,
    popoverOpenAnimation,
    popoverCloseAnimation,
    popoverId,
  };

  // Get components
  const triggerSource = beacon.trigger?.component || config.trigger?.component;
  const popoverSource = beacon.popover.component || config.popover?.component;

  // Guard clauses
  if (!calculatedPosition || !targetElement) {
    if (debug) {
      console.warn(
        `[Repere] ${beacon.id} waiting for target element: position=${!!calculatedPosition}, element=${!!targetElement}`,
      );
    }
    return null;
  }

  if (!popoverSource) {
    if (debug) {
      console.warn(
        "[Repere] No popover component provided for beacon:",
        beacon.id,
      );
    }
    return null;
  }

  return (
    <RepereContext.Provider value={contextValue}>
      {renderTriggerComponent(triggerSource, {
        beacon,
        calculatedPosition,
        position,
        isOpen,
        togglePopover,
      })}
      {renderPopoverComponent(popoverSource, {
        beacon,
        position,
        handleDismiss,
        hidePopover,
        handlePopoverRef,
        popoverId,
      })}
    </RepereContext.Provider>
  );
}
