import { combineTranslateWithAnimation } from "@repere/core";
import { motion, type Variants } from "motion/react";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { useBeaconContext } from "../context/BeaconContext";

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
    const {
      calculatedPosition,
      beaconId,
      triggerAnimation,
      triggerDismissAnimation,
      isDismissing,
      popoverId,
    } = useBeaconContext();

    if (!calculatedPosition) return null;

    const positionStyle = {
      position: calculatedPosition.position,
      top: calculatedPosition.top,
      left: calculatedPosition.left,
      zIndex: calculatedPosition.zIndex,
      pointerEvents: "auto" as const,
      cursor: "pointer",
      anchorName: `--repere-trigger-${beaconId}`,
    };

    const style = userStyle
      ? { ...positionStyle, ...userStyle }
      : positionStyle;

    const shouldAnimate =
      !disableAnimation && (triggerAnimation || triggerDismissAnimation);

    if (shouldAnimate) {
      // Use dismiss animation when dismissing, otherwise use render animation
      const activeAnimation =
        isDismissing && triggerDismissAnimation
          ? triggerDismissAnimation
          : triggerAnimation;

      if (!activeAnimation) return null;

      const combinedVariants = combineTranslateWithAnimation(
        calculatedPosition.translate,
        activeAnimation.variants,
      ) as unknown as Variants;

      return (
        <motion.button
          ref={ref}
          popovertarget={popoverId}
          aria-label={`Beacon trigger for ${beaconId}`}
          data-repere-trigger=""
          initial="initial"
          animate={isDismissing ? "exit" : "animate"}
          variants={combinedVariants}
          transition={activeAnimation.transition as any}
          {...props}
          style={style}
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
        style={
          {
            ...style,
            translate: `${calculatedPosition.translate.x} ${calculatedPosition.translate.y}`,
          } as React.CSSProperties
        }
      >
        {children}
      </button>
    );
  },
);
RepereTrigger.displayName = "RepereTrigger";
export { RepereTrigger };
