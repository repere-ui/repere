import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
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
export default PopoverContent;
