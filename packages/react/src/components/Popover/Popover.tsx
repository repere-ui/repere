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
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      style: userStyle,
      popover = "auto",
      disableAnimation,
      ...props
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
        {...props}
        style={style}
      >
        {children}
      </div>
    );
  },
);

Popover.displayName = "ReperePopover";
export default Popover;
