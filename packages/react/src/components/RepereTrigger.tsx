import { combineTranslateWithAnimation } from "@repere/core";
import { motion, type Variants } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  forwardRef,
  type ReactElement,
  type ReactNode,
  useMemo,
} from "react";
import { useBeaconContext } from "../context/BeaconContext";

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
      calculatedPosition,
      beaconId,
      triggerAnimation,
      triggerDismissAnimation,
      isDismissing,
      popoverId,
    } = useBeaconContext();

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

    const commonProps = {
      ref,
      popovertarget: popoverId,
      "aria-label": `Beacon trigger for ${beaconId}`,
      "data-repere-trigger": "",
      ...props,
    };

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
        <MotionComponent
          initial="initial"
          animate={isDismissing ? "exit" : "animate"}
          variants={combinedVariants}
          transition={activeAnimation.transition as any}
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
        style={
          {
            ...style,
            translate: `${calculatedPosition.translate.x} ${calculatedPosition.translate.y}`,
          } as React.CSSProperties
        }
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
