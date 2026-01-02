import type { Beacon, CalculatedBeaconPosition, Position } from "@repere/core";
import { cloneElement, isValidElement, type ReactElement } from "react";
import type { ReactComponent } from "../types";

interface TriggerProps {
  beacon: Beacon<unknown>;
  style?: CalculatedBeaconPosition;
  position?: Position;
  isOpen: boolean;
  onClick: () => void;
}

interface PopoverProps {
  beacon: Beacon<unknown>;
  position?: Position;
  onDismiss: () => void;
  onClose: () => void;
}

export function renderTriggerComponent(
  triggerSource: ReactComponent | undefined,
  props: {
    beacon: Beacon;
    calculatedPosition: CalculatedBeaconPosition;
    position: Position;
    isOpen: boolean;
    togglePopover: () => void;
  },
): ReactElement | null {
  if (!triggerSource) return null;

  if (isValidElement(triggerSource)) {
    return triggerSource;
  }

  const TriggerComponent = triggerSource as React.ComponentType<TriggerProps>;
  return (
    <TriggerComponent
      beacon={props.beacon}
      style={props.calculatedPosition}
      position={props.position}
      isOpen={props.isOpen}
      onClick={props.togglePopover}
    />
  );
}

export function renderPopoverComponent(
  popoverSource: ReactComponent,
  props: {
    beacon: Beacon;
    position: Position;
    handleDismiss: () => void;
    hidePopover: () => void;
    handlePopoverRef: (node: HTMLDivElement | null) => void;
    popoverId: string;
  },
): ReactElement {
  let element: ReactElement;

  if (isValidElement(popoverSource)) {
    element = popoverSource;
  } else {
    const PopoverComponent = popoverSource as React.ComponentType<PopoverProps>;
    element = (
      <PopoverComponent
        beacon={props.beacon}
        position={props.position}
        onDismiss={props.handleDismiss}
        onClose={props.hidePopover}
      />
    );
  }

  return cloneElement(element, {
    ref: props.handlePopoverRef,
    id: props.popoverId,
    popover: "auto",
  });
}
