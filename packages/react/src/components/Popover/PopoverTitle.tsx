import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
} from "react";
import { useBeaconContext } from "../../context/BeaconContext";

type PolymorphicRef<C extends ElementType> = ComponentPropsWithoutRef<C>["ref"];

export interface PopoverTitleProps<T extends ElementType = "h3"> {
  children: ReactNode;
  as?: T;
}

type PopoverTitleComponent = <C extends ElementType = "h3">(
  props: PopoverTitleProps<C> & { ref?: PolymorphicRef<C> },
) => React.ReactElement | null;

const PopoverTitleImpl = forwardRef(
  <C extends ElementType = "h3">(
    { children, as, ...props }: PopoverTitleProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const context = useBeaconContext();
    const beaconId = context?.beaconId || "unknown";

    const Component = (as || "h3") as ElementType;

    return (
      <Component ref={ref} id={`repere-popover-${beaconId}`} {...props}>
        {children}
      </Component>
    );
  },
) as PopoverTitleComponent;

const PopoverTitle = Object.assign(PopoverTitleImpl, {
  displayName: "ReperePopover.Title",
});

export default PopoverTitle;
