import { combineTranslateWithAnimation } from "@repere/core";
import { motion, type Transition, type Variants } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  forwardRef,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react";
import { useRepereContext } from "../context/RepereContext";

type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>["ref"];

type RepereTriggerOwnProps<C extends ElementType = ElementType> = {
  as?: C;
  children?: ReactNode;
  style?: CSSProperties;
  disableAnimation?: boolean;
};

export type RepereTriggerProps<C extends ElementType = "button"> =
  RepereTriggerOwnProps<C> &
    Omit<
      ComponentPropsWithoutRef<C>,
      | keyof RepereTriggerOwnProps<C>
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
      | "onAnimationStart"
      | "onAnimationEnd"
      | "onAnimationIteration"
    >;

type RepereTriggerComponent = <C extends ElementType = "button">(
  props: RepereTriggerProps<C> & { ref?: PolymorphicRef<C> },
) => ReactElement | null;

const RepereTriggerImpl = forwardRef(
  <C extends ElementType = "button">(
    {
      children,
      as,
      style: userStyle,
      disableAnimation,
      ...props
    }: RepereTriggerProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const {
      calculatedAnchorPoint,
      beaconId,
      triggerAnimation,
      triggerDismissAnimation,
      isDismissing,
      popoverId,
    } = useRepereContext();

    const Component = (as || "button") as ElementType;

    // Memoize the motion component to prevent recreation on every render
    const MotionComponent = useMemo(() => {
      // Use the pre-built motion.button for the default case (optimization)
      if (!as || as === "button") {
        return motion.button;
      }
      // Only create dynamic motion component for custom elements
      return motion.create(Component);
    }, [as, Component]);

    if (!calculatedAnchorPoint) return null;

    const positionStyle = {
      position: calculatedAnchorPoint.position,
      top: calculatedAnchorPoint.top,
      left: calculatedAnchorPoint.left,
      zIndex: calculatedAnchorPoint.zIndex,
      pointerEvents: "auto" as const,
      cursor: "pointer",
      anchorName: `--repere-trigger-${beaconId}`,
    };

    const style = userStyle
      ? { ...positionStyle, ...userStyle }
      : positionStyle;

    const shouldAnimate =
      !disableAnimation && (triggerAnimation || triggerDismissAnimation);

    const commonProps = {
      ref,
      popovertarget: popoverId,
      "aria-label": `Beacon trigger for ${beaconId}`,
      "data-repere-trigger": "",
      ...props,
    };

    if (shouldAnimate) {
      const activeAnimation =
        isDismissing && triggerDismissAnimation
          ? triggerDismissAnimation
          : triggerAnimation;

      if (!activeAnimation) return null;

      const combinedVariants = combineTranslateWithAnimation(
        calculatedAnchorPoint.translate,
        activeAnimation.variants,
      ) as unknown as Variants;

      return (
        <MotionComponent
          initial="initial"
          animate={isDismissing ? "exit" : "animate"}
          variants={combinedVariants}
          transition={activeAnimation.transition as Transition}
          {...commonProps}
          style={style}
        >
          {children}
        </MotionComponent>
      );
    }

    return (
      <Component
        {...commonProps}
        style={{
          ...style,
          translate: `${calculatedAnchorPoint.translate.x} ${calculatedAnchorPoint.translate.y}`,
        }}
      >
        {children}
      </Component>
    );
  },
) as RepereTriggerComponent;

const RepereTrigger = Object.assign(RepereTriggerImpl, {
  displayName: "RepereTrigger",
});

export { RepereTrigger };
