import type { AnchorPoint, Beacon } from "@repere/core";
import { getPopoverAnimationStyles } from "@repere/core";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
} from "react";
import { useRepereContext } from "../../context/RepereContext";

export interface PopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children: ReactNode;
  style?: React.CSSProperties;
  popover?: "auto" | "manual" | "hint" | "";
  disableAnimation?: boolean;
  // Internal props passed by RepereProvider that should not reach the DOM
  beacon?: Beacon;
  anchorPoint?: AnchorPoint;
  onDismiss?: () => void;
  onClose?: () => void;
}

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      children,
      style: userStyle,
      popover = "auto",
      disableAnimation,
      // Destructure and discard internal props so they don't spread to DOM
      beacon: _beacon,
      anchorPoint: _anchorPoint,
      onDismiss: _onDismiss,
      onClose: _onClose,
      ...domProps
    },
    ref,
  ) {
    const {
      beaconId,
      popoverId,
      popoverOpenAnimation,
      popoverCloseAnimation,
      popoverAnchorPoint,
      popoverOffset,
    } = useRepereContext();

    const internalRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
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
        id={popoverId}
        role="dialog"
        aria-labelledby={`repere-popover-${beaconId}`}
        data-repere-popover=""
        data-anchor-point={popoverAnchorPoint}
        popover={popover}
        {...domProps}
        style={style}
      >
        {children}
      </div>
    );
  },
);
