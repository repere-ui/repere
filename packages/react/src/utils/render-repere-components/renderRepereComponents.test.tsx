import { AnchorPoint, type Beacon } from "@repere/core";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactComponent } from "../../types";
import {
  renderPopoverComponent,
  renderTriggerComponent,
} from "./renderRepereComponents";

afterEach(() => {
  cleanup();
});

const mockBeacon: Beacon = {
  id: "test-beacon",
  selector: "#test",
  popover: {},
};

const mockCalculatedAnchorPoint = {
  top: 100,
  left: 200,
  translate: { x: "-50%", y: "0%" },
  position: "absolute" as const,
  zIndex: 9999,
};

describe("renderTriggerComponent", () => {
  it("should return null when component is undefined", () => {
    const result = renderTriggerComponent(undefined, {
      beacon: mockBeacon,
      calculatedAnchorPoint: mockCalculatedAnchorPoint,
      anchorPoint: AnchorPoint.TopRight,
      isOpen: false,
      togglePopover: vi.fn(),
    });

    expect(result).toBeNull();
  });

  it("should render function component with correct props", () => {
    const TriggerComponent = (props: { beacon: Beacon; isOpen: boolean }) => (
      <button
        type="button"
        data-testid="trigger-func"
        data-beacon-id={props.beacon.id}
      >
        {props.isOpen ? "Open" : "Closed"}
      </button>
    );

    const result = renderTriggerComponent(TriggerComponent as ReactComponent, {
      beacon: mockBeacon,
      calculatedAnchorPoint: mockCalculatedAnchorPoint,
      anchorPoint: AnchorPoint.TopRight,
      isOpen: true,
      togglePopover: vi.fn(),
    });

    if (result) {
      render(result);
    }

    const trigger = screen.getByTestId("trigger-func");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-beacon-id", "test-beacon");
    expect(trigger).toHaveTextContent("Open");
  });

  it("should clone element when passed a ReactElement", () => {
    const element = (
      <button type="button" data-testid="trigger-element">
        Click me
      </button>
    );

    const result = renderTriggerComponent(element, {
      beacon: mockBeacon,
      calculatedAnchorPoint: mockCalculatedAnchorPoint,
      anchorPoint: AnchorPoint.TopRight,
      isOpen: false,
      togglePopover: vi.fn(),
    });

    if (result) {
      render(result);
    }

    expect(screen.getByTestId("trigger-element")).toBeInTheDocument();
  });
});

describe("renderPopoverComponent", () => {
  const defaultProps = {
    beacon: mockBeacon,
    anchorPoint: AnchorPoint.BottomCenter,
    handleDismiss: vi.fn(),
    hidePopover: vi.fn(),
    handlePopoverRef: vi.fn(),
    popoverId: "popover-1",
  };

  it("should render function component with correct props", () => {
    const PopoverComponent = (props: {
      beacon: Beacon;
      onDismiss: () => void;
    }) => (
      <div data-testid="popover-func" data-beacon-id={props.beacon.id}>
        <button type="button" onClick={props.onDismiss}>
          Dismiss
        </button>
      </div>
    );

    const result = renderPopoverComponent(
      PopoverComponent as ReactComponent,
      defaultProps,
    );

    render(result);

    const popover = screen.getByTestId("popover-func");
    expect(popover).toBeInTheDocument();
    expect(popover).toHaveAttribute("data-beacon-id", "test-beacon");
  });

  it("should clone element when passed a ReactElement", () => {
    const element = <div data-testid="popover-element">Popover content</div>;

    const result = renderPopoverComponent(element, defaultProps);

    render(result);

    expect(screen.getByTestId("popover-element")).toBeInTheDocument();
    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  it("should pass onDismiss and onClose handlers", () => {
    const handleDismiss = vi.fn();
    const hidePopover = vi.fn();

    const PopoverComponent = (props: {
      onDismiss: () => void;
      onClose: () => void;
    }) => (
      <div data-testid="popover-handlers">
        <button
          type="button"
          data-testid="dismiss-btn"
          onClick={props.onDismiss}
        >
          Dismiss
        </button>
        <button type="button" data-testid="close-btn" onClick={props.onClose}>
          Close
        </button>
      </div>
    );

    const result = renderPopoverComponent(PopoverComponent as ReactComponent, {
      ...defaultProps,
      handleDismiss,
      hidePopover,
    });

    render(result);

    screen.getByTestId("dismiss-btn").click();
    expect(handleDismiss).toHaveBeenCalled();

    screen.getByTestId("close-btn").click();
    expect(hidePopover).toHaveBeenCalled();
  });
});
