import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { useBeaconContext } from "../../context/BeaconContext";

export interface PopoverCloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
export default PopoverCloseButton;
