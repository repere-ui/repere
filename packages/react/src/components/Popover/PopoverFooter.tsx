import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface PopoverFooterProps extends HTMLAttributes<HTMLDivElement> {
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
export default PopoverFooter;
