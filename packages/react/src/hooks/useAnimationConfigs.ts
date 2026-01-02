import type { Beacon } from "@repere/core";
import { getAnimationConfig, mergeAnimationConfigs } from "@repere/core";
import { useMemo } from "react";
import type { RepereReactConfig } from "../types";

export function useAnimationConfigs(beacon: Beacon, config: RepereReactConfig) {
  const triggerAnimation = useMemo(() => {
    const rootAnim = config.trigger?.animations?.onRender;
    const beaconAnim = beacon.trigger?.animations?.onRender;
    return getAnimationConfig(mergeAnimationConfigs(rootAnim, beaconAnim));
  }, [config.trigger?.animations, beacon.trigger?.animations]);

  const triggerDismissAnimation = useMemo(() => {
    const rootAnim = config.trigger?.animations?.onDismiss;
    const beaconAnim = beacon.trigger?.animations?.onDismiss;
    return getAnimationConfig(mergeAnimationConfigs(rootAnim, beaconAnim));
  }, [
    config.trigger?.animations?.onDismiss,
    beacon.trigger?.animations?.onDismiss,
  ]);

  const popoverOpenAnimation = useMemo(() => {
    const rootAnim = config.popover?.animations?.onOpen;
    const beaconAnim = beacon.popover?.animations?.onOpen;
    return getAnimationConfig(mergeAnimationConfigs(rootAnim, beaconAnim));
  }, [config.popover?.animations?.onOpen, beacon.popover?.animations?.onOpen]);

  const popoverCloseAnimation = useMemo(() => {
    const rootAnim = config.popover?.animations?.onClose;
    const beaconAnim = beacon.popover?.animations?.onClose;
    return getAnimationConfig(mergeAnimationConfigs(rootAnim, beaconAnim));
  }, [
    config.popover?.animations?.onClose,
    beacon.popover?.animations?.onClose,
  ]);

  return {
    triggerAnimation,
    triggerDismissAnimation,
    popoverOpenAnimation,
    popoverCloseAnimation,
  };
}
