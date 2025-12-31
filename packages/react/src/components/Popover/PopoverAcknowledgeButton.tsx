import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { useBeaconContext } from "../../context/BeaconContext";

export interface PopoverAcknowledgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

const PopoverAcknowledgeButton = forwardRef<
  HTMLButtonElement,
  PopoverAcknowledgeButtonProps
>(({ children = "Got it", onClick, ...props }, ref) => {
  const context = useBeaconContext();
  const dismiss = context?.dismiss || (() => {});
  const popoverId = context?.popoverId;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    dismiss(); // Mark as dismissed in storage
    onClick?.(e); // Call user's onClick if provided
    // No need to close - popovertargetaction="hide" handles it
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      popovertarget={popoverId}
      popovertargetaction="hide"
      {...props}
    >
      {children}
    </button>
  );
});
PopoverAcknowledgeButton.displayName = "ReperePopover.AcknowledgeButton";
export default PopoverAcknowledgeButton;
