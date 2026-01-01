import type { Beacon, Position } from "@repere/core";
import { getPopoverAnimationStyles } from "@repere/core";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
} from "react";
import { useBeaconContext } from "../../context/BeaconContext";

export interface PopoverProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "style"
> {
  children: ReactNode;
  style?: React.CSSProperties;
  popover?: "auto" | "manual" | "hint" | "";
  disableAnimation?: boolean;
  // Internal props passed by BeaconRenderer that should not reach the DOM
  beacon?: Beacon;
  position?: Position;
  onDismiss?: () => void;
  onClose?: () => void;
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      style: userStyle,
      popover = "auto",
      disableAnimation,
      // Destructure and discard internal props so they don't spread to DOM
      beacon: _beacon,
      position: _position,
      onDismiss: _onDismiss,
      onClose: _onClose,
      ...domProps
    },
    ref,
  ) => {
    const {
      beaconId,
      popoverOpenAnimation,
      popoverCloseAnimation,
      popoverPosition,
      popoverOffset,
    } = useBeaconContext();

    // Combine refs
    const internalRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    // Set unique position-anchor for this popover
    const positionAnchor = beaconId
      ? `--repere-trigger-${beaconId}`
      : undefined;

    const style = {
      positionAnchor,
      ...(popoverOffset && {
        marginLeft: popoverOffset.x || 0,
        marginTop: popoverOffset.y || 0,
      }),
      ...getPopoverAnimationStyles(popoverOpenAnimation, popoverCloseAnimation),
      ...userStyle,
    };

    return (
      <div
        ref={internalRef}
        role="dialog"
        aria-labelledby={`repere-popover-${beaconId}`}
        data-repere-popover=""
        data-position={popoverPosition}
        popover={popover}
        {...domProps}
        style={style}
      >
        {children}
      </div>
    );
  },
);

Popover.displayName = "ReperePopover";
export default Popover;
