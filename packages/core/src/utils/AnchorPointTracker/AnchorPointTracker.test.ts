import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnchorPoint } from "../../types/anchors";
import { PositioningStrategy } from "../../types/beacon";
import { AnchorPointTracker } from "./AnchorPointTracker";

describe("AnchorPointTracker", () => {
  let tracker: AnchorPointTracker;
  let mockElement: HTMLElement;

  beforeEach(() => {
    tracker = new AnchorPointTracker();

    mockElement = document.createElement("div");
    mockElement.id = "test-element";
    document.body.appendChild(mockElement);

    vi.spyOn(mockElement, "getBoundingClientRect").mockReturnValue({
      top: 100,
      left: 200,
      right: 300,
      bottom: 150,
      width: 100,
      height: 50,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    });

    vi.stubGlobal("scrollX", 0);
    vi.stubGlobal("scrollY", 0);
  });

  afterEach(() => {
    tracker.destroy();
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  describe("subscribe with absolute positioning", () => {
    it("should calculate anchor point immediately", () => {
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Absolute,
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 100,
          left: 300,
          position: "absolute",
        }),
      );
    });

    it("should call callback with null when element not found", () => {
      const callback = vi.fn();

      tracker.subscribe("#nonexistent", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Absolute,
      });

      expect(callback).toHaveBeenCalledWith(null);
    });

    it("should apply offset to calculated position", () => {
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopLeft, callback, {
        offset: { x: 10, y: 20 },
        positioningStrategy: PositioningStrategy.Absolute,
      });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 120,
          left: 210,
        }),
      );
    });

    it("should apply custom zIndex", () => {
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        zIndex: 5000,
        positioningStrategy: PositioningStrategy.Absolute,
      });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          zIndex: 5000,
        }),
      );
    });

    it("should delay calculation when delay is specified", () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        delay: 100,
        positioningStrategy: PositioningStrategy.Absolute,
      });

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(callback).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it("should return unsubscribe function that clears timeout", () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      const unsubscribe = tracker.subscribe(
        "#test-element",
        AnchorPoint.TopRight,
        callback,
        {
          delay: 100,
          positioningStrategy: PositioningStrategy.Absolute,
        },
      );

      unsubscribe();
      vi.advanceTimersByTime(100);

      expect(callback).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe("subscribe with fixed positioning", () => {
    it("should calculate anchor point with fixed position", () => {
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          position: "fixed",
        }),
      );
    });

    it("should start listening for changes on first subscription", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true,
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });

    it("should stop listening when all subscriptions are removed", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const callback = vi.fn();

      const unsubscribe = tracker.subscribe(
        "#test-element",
        AnchorPoint.TopRight,
        callback,
        { positioningStrategy: PositioningStrategy.Fixed },
      );

      unsubscribe();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        true,
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });

    it("should update on scroll events", async () => {
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      callback.mockClear();

      window.dispatchEvent(new Event("scroll"));

      await new Promise((resolve) => requestAnimationFrame(resolve));

      expect(callback).toHaveBeenCalled();
    });

    it("should handle multiple callbacks for same selector", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback1, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback2, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("should only remove specific callback on unsubscribe", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = tracker.subscribe(
        "#test-element",
        AnchorPoint.TopRight,
        callback1,
        { positioningStrategy: PositioningStrategy.Fixed },
      );

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback2, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      unsubscribe1();

      callback1.mockClear();
      callback2.mockClear();

      window.dispatchEvent(new Event("scroll"));

      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          expect(callback1).not.toHaveBeenCalled();
          expect(callback2).toHaveBeenCalled();
          resolve();
        });
      });
    });
  });

  describe("default positioning strategy", () => {
    it("should default to absolute positioning", () => {
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          position: "absolute",
        }),
      );
    });
  });

  describe("destroy", () => {
    it("should clean up all subscriptions and listeners", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Fixed,
      });

      tracker.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });

    it("should clear pending timeouts", () => {
      vi.useFakeTimers();
      const callback = vi.fn();

      tracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        delay: 100,
        positioningStrategy: PositioningStrategy.Fixed,
      });

      tracker.destroy();
      vi.advanceTimersByTime(100);

      expect(callback).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });

  describe("debug mode", () => {
    it("should log when debug is enabled", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const debugTracker = new AnchorPointTracker(true);
      const callback = vi.fn();

      debugTracker.subscribe("#test-element", AnchorPoint.TopRight, callback, {
        positioningStrategy: PositioningStrategy.Absolute,
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
      debugTracker.destroy();
    });
  });
});
