import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useBeaconContext } from "../../context/BeaconContext";

export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ children, as: Component = "h3", ...props }, ref) => {
    const context = useBeaconContext();
    const beaconId = context?.beaconId || "unknown";

    return (
      <Component ref={ref} id={`repere-popover-${beaconId}`} {...props}>
        {children}
      </Component>
    );
  },
);

PopoverTitle.displayName = "ReperePopover.Title";

export default PopoverTitle;
