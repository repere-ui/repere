import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
} from "react";
import { useBeaconContext } from "../../context/BeaconContext";

type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>["ref"];

type PopoverAcknowledgeButtonOwnProps<C extends ElementType = ElementType> = {
  as?: C;
  children?: ReactNode;
};

export type PopoverAcknowledgeButtonProps<C extends ElementType = "button"> =
  PopoverAcknowledgeButtonOwnProps<C> &
    Omit<
      ComponentPropsWithoutRef<C>,
      keyof PopoverAcknowledgeButtonOwnProps<C>
    >;

type PopoverAcknowledgeButtonComponent = <C extends ElementType = "button">(
  props: PopoverAcknowledgeButtonProps<C> & { ref?: PolymorphicRef<C> },
) => React.ReactElement | null;

const PopoverAcknowledgeButtonImpl = forwardRef(
  <C extends ElementType = "button">(
    {
      children = "Got it",
      onClick,
      as,
      ...props
    }: PopoverAcknowledgeButtonProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const context = useBeaconContext();
    const dismiss = context?.dismiss || (() => {});
    const popoverId = context?.popoverId;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      dismiss();
      onClick?.(e);
    };

    const Component = (as || "button") as ElementType;

    return (
      <Component
        ref={ref}
        onClick={handleClick}
        popovertarget={popoverId}
        popovertargetaction="hide"
        {...props}
      >
        {children}
      </Component>
    );
  },
) as PopoverAcknowledgeButtonComponent;

const PopoverAcknowledgeButton = Object.assign(PopoverAcknowledgeButtonImpl, {
  displayName: "ReperePopover.AcknowledgeButton",
});

export default PopoverAcknowledgeButton;
