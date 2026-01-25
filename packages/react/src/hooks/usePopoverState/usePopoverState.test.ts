import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePopoverState } from "./usePopoverState";

describe("usePopoverState", () => {
  it("should initialize with isOpen as false", () => {
    const { result } = renderHook(() => usePopoverState());

    expect(result.current.isOpen).toBe(false);
  });

  it("should initialize with popoverElement as null", () => {
    const { result } = renderHook(() => usePopoverState());

    expect(result.current.popoverElement).toBeNull();
  });

  it("should set popoverElement via handlePopoverRef", () => {
    const { result } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    expect(result.current.popoverElement).toBe(mockDiv);
  });

  it("should call togglePopover on popoverElement", () => {
    const { result } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");
    mockDiv.togglePopover = vi.fn();

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    act(() => {
      result.current.togglePopover();
    });

    expect(mockDiv.togglePopover).toHaveBeenCalled();
  });

  it("should call showPopover on popoverElement", () => {
    const { result } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");
    mockDiv.showPopover = vi.fn();

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    act(() => {
      result.current.showPopover();
    });

    expect(mockDiv.showPopover).toHaveBeenCalled();
  });

  it("should call hidePopover on popoverElement", () => {
    const { result } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");
    mockDiv.hidePopover = vi.fn();

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    act(() => {
      result.current.hidePopover();
    });

    expect(mockDiv.hidePopover).toHaveBeenCalled();
  });

  it("should update isOpen when toggle event fires with open state", () => {
    const { result } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    act(() => {
      const toggleEvent = new Event("toggle") as Event & {
        newState: string;
      };
      Object.defineProperty(toggleEvent, "newState", { value: "open" });
      mockDiv.dispatchEvent(toggleEvent);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should update isOpen when toggle event fires with closed state", () => {
    const { result } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    act(() => {
      const openEvent = new Event("toggle") as Event & { newState: string };
      Object.defineProperty(openEvent, "newState", { value: "open" });
      mockDiv.dispatchEvent(openEvent);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      const closeEvent = new Event("toggle") as Event & { newState: string };
      Object.defineProperty(closeEvent, "newState", { value: "closed" });
      mockDiv.dispatchEvent(closeEvent);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("should clean up event listener on unmount", () => {
    const { result, unmount } = renderHook(() => usePopoverState());
    const mockDiv = document.createElement("div");
    const removeEventListenerSpy = vi.spyOn(mockDiv, "removeEventListener");

    act(() => {
      result.current.handlePopoverRef(mockDiv);
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "toggle",
      expect.any(Function),
    );
  });

  it("should not throw when toggling without popoverElement", () => {
    const { result } = renderHook(() => usePopoverState());

    expect(() => {
      act(() => {
        result.current.togglePopover();
        result.current.showPopover();
        result.current.hidePopover();
      });
    }).not.toThrow();
  });

  it("should return stable callback references", () => {
    const { result, rerender } = renderHook(() => usePopoverState());

    const firstHandlePopoverRef = result.current.handlePopoverRef;

    rerender();

    expect(result.current.handlePopoverRef).toBe(firstHandlePopoverRef);
  });
});
