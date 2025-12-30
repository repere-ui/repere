import { motion } from "motion/react";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useBeaconContext } from "../context/BeaconContext";

interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
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
    const context = useBeaconContext();
    const internalRef = useRef<HTMLDivElement>(
      null,
    ) as React.MutableRefObject<HTMLDivElement | null>;
    const [isOpen, setIsOpen] = useState(false);

    const { calculatedPosition, beaconId, popoverAnimation } = context || {};

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
        const toggleEvent = e as any; // ToggleEvent type might not be available
        setIsOpen(toggleEvent.newState === "open");
      };

      element.addEventListener("toggle", handleToggle);
      return () => element.removeEventListener("toggle", handleToggle);
    }, []);

    if (context && !calculatedPosition) return null;

    const positionStyle = calculatedPosition
      ? {
          position: "fixed" as const,
          top: calculatedPosition.top,
          left: calculatedPosition.left,
          zIndex: calculatedPosition.zIndex + 1,
          pointerEvents: "auto" as const,
        }
      : {};

    const style = userStyle
      ? { ...positionStyle, ...userStyle }
      : positionStyle;

    const shouldAnimate = !disableAnimation && popoverAnimation;

    // Separate props to avoid conflicts
    const { onDrag, onDragStart, onDragEnd, ...restProps } = props;

    if (shouldAnimate) {
      return (
        <motion.div
          ref={setRefs}
          role="dialog"
          aria-labelledby={`repere-popover-${beaconId}`}
          data-repere-popover=""
          initial="exit"
          animate={isOpen ? "animate" : "exit"}
          variants={popoverAnimation.variants}
          transition={popoverAnimation.transition}
          {...restProps}
          {...({ popover } as any)}
          style={style as any}
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
        popover={popover}
        {...restProps}
        style={style as any}
      >
        {children}
      </div>
    );
  },
);

Popover.displayName = "ReperePopover";

// Title
interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ children, as: Component = "h3", ...props }, ref) => {
    const context = useBeaconContext();
    const beaconId = context?.beaconId || "unknown";

    return (
      <Component ref={ref as any} id={`repere-popover-${beaconId}`} {...props}>
        {children}
      </Component>
    );
  },
);
PopoverTitle.displayName = "ReperePopover.Title";

// Content
interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
PopoverContent.displayName = "ReperePopover.Content";

// Footer
interface PopoverFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const PopoverFooter = forwardRef<HTMLDivElement, PopoverFooterProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
PopoverFooter.displayName = "ReperePopover.Footer";

// AcknowledgeButton - dismisses AND closes
interface PopoverAcknowledgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

const PopoverAcknowledgeButton = forwardRef<
  HTMLButtonElement,
  PopoverAcknowledgeButtonProps
>(({ children = "Got it", onClick, ...props }, ref) => {
  const context = useBeaconContext();
  const dismiss = context?.dismiss || (() => {});
  const popoverId = context?.popoverId;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await dismiss(); // Mark as dismissed in storage
    onClick?.(e); // Call user's onClick if provided
    // No need to close - popovertargetaction="hide" handles it
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      popovertarget={popoverId}
      popovertargetaction="hide"
      {...props}
    >
      {children}
    </button>
  );
});
PopoverAcknowledgeButton.displayName = "ReperePopover.AcknowledgeButton";

// Close button - just closes, doesn't dismiss
interface PopoverCloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

const PopoverCloseButton = forwardRef<
  HTMLButtonElement,
  PopoverCloseButtonProps
>(({ children = "×", ...props }, ref) => {
  const context = useBeaconContext();
  const popoverId = context?.popoverId;

  return (
    <button
      ref={ref}
      popovertarget={popoverId}
      popovertargetaction="hide"
      aria-label="Close"
      {...props}
    >
      {children}
    </button>
  );
});
PopoverCloseButton.displayName = "ReperePopover.CloseButton";

export const ReperePopover = Object.assign(Popover, {
  Title: PopoverTitle,
  Content: PopoverContent,
  Footer: PopoverFooter,
  AcknowledgeButton: PopoverAcknowledgeButton,
  CloseButton: PopoverCloseButton,
});
