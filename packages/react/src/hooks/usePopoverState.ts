import { useCallback, useEffect, useState } from "react";
import type { ToggleEvent } from "../types";

export function usePopoverState() {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverElement, setPopoverElement] = useState<HTMLDivElement | null>(
    null,
  );

  const handlePopoverRef = useCallback((node: HTMLDivElement | null) => {
    setPopoverElement(node);
  }, []);

  const togglePopover = useCallback(
    () => popoverElement?.togglePopover(),
    [popoverElement],
  );

  const showPopover = useCallback(
    () => popoverElement?.showPopover(),
    [popoverElement],
  );

  const hidePopover = useCallback(
    () => popoverElement?.hidePopover(),
    [popoverElement],
  );

  // Track popover open state
  useEffect(() => {
    if (!popoverElement) return;

    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      setIsOpen(toggleEvent.newState === "open");
    };

    popoverElement.addEventListener("toggle", handleToggle);
    return () => popoverElement.removeEventListener("toggle", handleToggle);
  }, [popoverElement]);

  return {
    isOpen,
    popoverElement,
    handlePopoverRef,
    togglePopover,
    showPopover,
    hidePopover,
  };
}
