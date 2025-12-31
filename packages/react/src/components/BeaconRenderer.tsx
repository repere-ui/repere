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
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
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
  const [isOpen, setIsOpen] = useState(false);
  const [popoverElement, setPopoverElement] = useState<HTMLDivElement | null>(
    null,
  );

  // Callback ref to track when popover element is mounted
  const handlePopoverRef = useCallback((node: HTMLDivElement | null) => {
    setPopoverElement(node);
  }, []);

  // Get popover methods
  const togglePopover = useCallback(
    () => popoverElement?.togglePopover(),
    [popoverElement],
  );
  const showPopover = useCallback(
    () => popoverElement?.showPopover(),
    [popoverElement],
  );
  const hidePopover = useCallback(
    () => popoverElement?.hidePopover(),
    [popoverElement],
  );

  // Resolve trigger config (beacon.trigger > config.trigger > defaults)
  const position: Position =
    beacon.trigger?.position || config.trigger?.position || DEFAULT_POSITION;
  const zIndex = beacon.trigger?.zIndex || config.trigger?.zIndex || 9999;
  const offset = beacon.trigger?.offset;

  // Calculate position for the trigger
  const { calculatedPosition, targetElement } = useBeaconPosition({
    targetSelector: beacon.selector,
    position,
    offset,
    zIndex,
    enabled: true,
    debug,
  });

  // Resolve trigger animations
  const triggerAnimationConfig = useMemo(() => {
    const rootTriggerAnim = config.trigger?.animations?.onRender;
    const beaconTriggerAnim = beacon.trigger?.animations?.onRender;
    const merged = mergeAnimationConfigs(
      rootTriggerAnim as any,
      beaconTriggerAnim as any,
    );
    return getAnimationConfig(merged);
  }, [config.trigger?.animations, beacon.trigger?.animations]);

  // Resolve popover animations
  const popoverOpenAnimationConfig = useMemo(() => {
    const rootPopoverAnim = config.popover?.animations?.onOpen;
    const beaconPopoverAnim = beacon.popover?.animations?.onOpen;
    const merged = mergeAnimationConfigs(
      rootPopoverAnim as any,
      beaconPopoverAnim as any,
    );
    const result = getAnimationConfig(merged);
    return result;
  }, [config.popover?.animations?.onOpen, beacon.popover?.animations?.onOpen]);

  const popoverCloseAnimationConfig = useMemo(() => {
    const rootPopoverAnim = config.popover?.animations?.onClose;
    const beaconPopoverAnim = beacon.popover?.animations?.onClose;

    const merged = mergeAnimationConfigs(
      rootPopoverAnim as any,
      beaconPopoverAnim as any,
    );
    const result = getAnimationConfig(merged);
    return result;
  }, [
    config.popover?.animations?.onClose,
    beacon.popover?.animations?.onClose,
  ]);

  // Track popover open state
  useEffect(() => {
    if (!popoverElement) return;

    const handleToggle = (e: Event) => {
      const toggleEvent = e as any;
      setIsOpen(toggleEvent.newState === "open");
    };

    popoverElement.addEventListener("toggle", handleToggle);
    return () => popoverElement.removeEventListener("toggle", handleToggle);
  }, [popoverElement]);

  // Actions
  const handleDismiss = async () => {
    await Promise.resolve(store.dismiss(beacon.id));
    popoverElement?.hidePopover();
    onDismiss();
  };

  const popoverPosition =
    beacon.popover?.position || config.popover?.position || position;
  const popoverOffset = beacon.popover?.offset ||
    config.popover?.offset || { x: 0, y: 0 };

  // Context value
  const contextValue: BeaconContextValue = {
    beaconId: beacon.id,
    position,
    popoverPosition,
    popoverOffset,
    calculatedPosition,
    isOpen,
    toggle: togglePopover,
    open: showPopover,
    close: hidePopover,
    dismiss: handleDismiss,
    triggerAnimation: triggerAnimationConfig,
    popoverOpenAnimation: popoverOpenAnimationConfig,
    popoverCloseAnimation: popoverCloseAnimationConfig,
    popoverId,
  };

  // Get components (beacon > config)
  const triggerSource = beacon.trigger?.component || config.trigger?.component;
  const popoverSource = beacon.popover.component || config.popover?.component;

  // Don't render if position not calculated yet
  if (!calculatedPosition || !targetElement) {
    if (debug) {
      console.warn(
        `[Repere] ${beacon.id} waiting for target element: position=${!!calculatedPosition}, element=${!!targetElement}`,
      );
    }
    return null;
  }

  // Popover component is required
  if (!popoverSource) {
    if (debug) {
      console.warn(
        "[Repere] No popover component provided for beacon:",
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
        isOpen={isOpen}
        onClick={togglePopover}
      />
    );
  };

  // Render popover with Popover API
  const renderPopover = () => {
    let element: ReactElement;

    if (isValidElement(popoverSource)) {
      element = popoverSource;
    } else {
      const PopoverComponent = popoverSource as React.ComponentType<any>;
      element = (
        <PopoverComponent
          beacon={beacon}
          position={position}
          onDismiss={handleDismiss}
          onClose={hidePopover}
        />
      );
    }

    // Clone and add popover attributes (works for both cases)
    return cloneElement(element, {
      ref: handlePopoverRef,
      id: popoverId,
      popover: "auto",
    });
  };

  return (
    <BeaconContext.Provider value={contextValue}>
      {renderTrigger()}
      {renderPopover()}
    </BeaconContext.Provider>
  );
}
