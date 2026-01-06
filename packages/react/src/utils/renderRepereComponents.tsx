import type {
  AnchorPoint,
  Beacon,
  CalculatedBeaconAnchorPoint,
} from "@repere/core";
import { cloneElement, isValidElement, type ReactElement } from "react";
import type { ReactComponent } from "../types";

interface TriggerProps {
  beacon: Beacon<unknown>;
  style?: CalculatedBeaconAnchorPoint;
  anchorPoint?: AnchorPoint;
  isOpen: boolean;
  onClick: () => void;
}

interface PopoverProps {
  beacon: Beacon<unknown>;
  anchorPoint?: AnchorPoint;
  onDismiss: () => void;
  onClose: () => void;
}

export function renderTriggerComponent(
  component: ReactComponent | undefined,
  props: {
    beacon: Beacon;
    calculatedAnchorPoint: CalculatedBeaconAnchorPoint;
    anchorPoint: AnchorPoint;
    isOpen: boolean;
    togglePopover: () => void;
  },
): ReactElement | null {
  if (!component) {
    return null;
  }

  if (isValidElement(component)) {
    return cloneElement(component as ReactElement<TriggerProps>, props);
  }

  const TriggerComponent = component as React.ComponentType<TriggerProps>;
  return (
    <TriggerComponent
      beacon={props.beacon}
      style={props.calculatedAnchorPoint}
      anchorPoint={props.anchorPoint}
      isOpen={props.isOpen}
      onClick={props.togglePopover}
    />
  );
}

export function renderPopoverComponent(
  component: ReactComponent,
  props: {
    beacon: Beacon;
    anchorPoint: AnchorPoint;
    handleDismiss: () => void;
    hidePopover: () => void;
    handlePopoverRef: (node: HTMLDivElement | null) => void;
    popoverId: string;
  },
): ReactElement {
  if (isValidElement(component)) {
    return cloneElement(component as ReactElement<PopoverProps>, {
      beacon: props.beacon,
      anchorPoint: props.anchorPoint,
      onDismiss: props.handleDismiss,
      onClose: props.hidePopover,
    });
  }

  const PopoverComponent = component as React.ComponentType<PopoverProps>;
  return (
    <PopoverComponent
      beacon={props.beacon}
      anchorPoint={props.anchorPoint}
      onDismiss={props.handleDismiss}
      onClose={props.hidePopover}
    />
  );
}
