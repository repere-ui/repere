import { motion } from "motion/react";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { useBeaconContext } from "../context/BeaconContext";

// Root trigger button - completely unstyled
interface RepereTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | "style"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  children?: ReactNode;
  asChild?: boolean;
  style?: React.CSSProperties;
  disableAnimation?: boolean;
}

const RepereTrigger = forwardRef<HTMLButtonElement, RepereTriggerProps>(
  (
    { children, asChild, style: userStyle, disableAnimation, ...props },
    ref,
  ) => {
    const { calculatedPosition, beaconId, triggerAnimation, popoverId } =
      useBeaconContext();

    if (!calculatedPosition) return null;

    const positionStyle = {
      position: calculatedPosition.position,
      top: calculatedPosition.top,
      left: calculatedPosition.left,
      transform: calculatedPosition.transform,
      zIndex: calculatedPosition.zIndex,
      pointerEvents: "auto" as const,
    };

    const style = userStyle
      ? { ...positionStyle, ...userStyle }
      : positionStyle;

    const shouldAnimate = !disableAnimation && triggerAnimation;

    if (shouldAnimate) {
      return (
        <motion.button
          ref={ref}
          popovertarget={popoverId}
          aria-label={`Beacon trigger for ${beaconId}`}
          data-repere-trigger=""
          initial="initial"
          animate="animate"
          variants={triggerAnimation.variants}
          transition={triggerAnimation.transition}
          {...props}
          style={style as any}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        popovertarget={popoverId}
        aria-label={`Beacon trigger for ${beaconId}`}
        data-repere-trigger=""
        {...props}
        style={style as React.CSSProperties}
      >
        {children}
      </button>
    );
  },
);
RepereTrigger.displayName = "RepereTrigger";
export { RepereTrigger };
