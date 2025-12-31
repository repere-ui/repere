import { motion } from "motion/react";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
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
    { children, style: userStyle, popover, disableAnimation, ...props },
    ref,
  ) => {
    const { beaconId, popoverAnimation, popoverPosition, popoverOffset } =
      useBeaconContext();
    const internalRef = useRef<HTMLDivElement>(
      null,
    ) as React.MutableRefObject<HTMLDivElement | null>;
    const [isOpen, setIsOpen] = useState(false);
    // Combine refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    // Listen to toggle events from Popover API
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      const handleToggle = (e: Event) => {
        const toggleEvent = e as any;
        setIsOpen(toggleEvent.newState === "open");
      };

      element.addEventListener("toggle", handleToggle);
      return () => element.removeEventListener("toggle", handleToggle);
    }, []);

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
      ...userStyle,
    };

    const shouldAnimate = !disableAnimation && popoverAnimation;

    // Separate props to avoid conflicts
    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...restProps
    } = props;

    if (shouldAnimate) {
      return (
        <motion.div
          ref={setRefs}
          role="dialog"
          aria-labelledby={`repere-popover-${beaconId}`}
          data-repere-popover=""
          data-position={popoverPosition}
          initial="exit"
          animate={isOpen ? "animate" : "exit"}
          variants={popoverAnimation.variants}
          transition={popoverAnimation.transition}
          {...restProps}
          popover={popover}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={setRefs}
        role="dialog"
        aria-labelledby={`repere-popover-${beaconId}`}
        data-repere-popover=""
        data-position={popoverPosition}
        popover={popover}
        {...restProps}
        style={style}
      >
        {children}
      </div>
    );
  },
);

Popover.displayName = "ReperePopover";
export default Popover;
