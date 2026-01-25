import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnchorPoint } from "../../types/anchors";
import { PositioningStrategy } from "../../types/beacon";
import { calculateAnchorPointCoords } from "./positioning";

describe("calculateAnchorPointCoords", () => {
  const mockRect: DOMRect = {
    top: 100,
    left: 200,
    right: 300,
    bottom: 150,
    width: 100,
    height: 50,
    x: 200,
    y: 100,
    toJSON: () => ({}),
  };

  beforeEach(() => {
    vi.stubGlobal("scrollX", 0);
    vi.stubGlobal("scrollY", 0);
  });

  describe("anchor point positions", () => {
    it("should calculate TopLeft anchor point", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft);
      expect(result).toEqual({
        top: 100,
        left: 200,
        translate: { x: "0%", y: "-100%" },
      });
    });

    it("should calculate TopCenter anchor point", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.TopCenter,
      );
      expect(result).toEqual({
        top: 100,
        left: 250, // 200 + 100/2
        translate: { x: "-50%", y: "-100%" },
      });
    });

    it("should calculate TopRight anchor point", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopRight);
      expect(result).toEqual({
        top: 100,
        left: 300, // rect.right
        translate: { x: "-100%", y: "-100%" },
      });
    });

    it("should calculate RightCenter anchor point", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.RightCenter,
      );
      expect(result).toEqual({
        top: 125, // 100 + 50/2
        left: 300, // rect.right
        translate: { x: "0%", y: "-50%" },
      });
    });

    it("should calculate BottomRight anchor point", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.BottomRight,
      );
      expect(result).toEqual({
        top: 150, // rect.bottom
        left: 300, // rect.right
        translate: { x: "-100%", y: "0%" },
      });
    });

    it("should calculate BottomCenter anchor point", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.BottomCenter,
      );
      expect(result).toEqual({
        top: 150, // rect.bottom
        left: 250, // 200 + 100/2
        translate: { x: "-50%", y: "0%" },
      });
    });

    it("should calculate BottomLeft anchor point", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.BottomLeft,
      );
      expect(result).toEqual({
        top: 150, // rect.bottom
        left: 200, // rect.left
        translate: { x: "0%", y: "0%" },
      });
    });

    it("should calculate LeftCenter anchor point", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.LeftCenter,
      );
      expect(result).toEqual({
        top: 125, // 100 + 50/2
        left: 200, // rect.left
        translate: { x: "-100%", y: "-50%" },
      });
    });

    it("should fallback to TopRight for unknown anchor points", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        "unknown" as AnchorPoint,
      );
      expect(result).toEqual({
        top: 100,
        left: 300,
        translate: { x: "-100%", y: "-100%" },
      });
    });
  });

  describe("offset handling", () => {
    it("should apply positive X offset", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft, {
        x: 10,
      });
      expect(result.left).toBe(210);
    });

    it("should apply negative X offset", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft, {
        x: -10,
      });
      expect(result.left).toBe(190);
    });

    it("should apply positive Y offset", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft, {
        y: 15,
      });
      expect(result.top).toBe(115);
    });

    it("should apply negative Y offset", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft, {
        y: -15,
      });
      expect(result.top).toBe(85);
    });

    it("should apply both X and Y offsets", () => {
      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft, {
        x: 20,
        y: 30,
      });
      expect(result.left).toBe(220);
      expect(result.top).toBe(130);
    });

    it("should handle undefined offset values", () => {
      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.TopLeft,
        {},
      );
      expect(result.left).toBe(200);
      expect(result.top).toBe(100);
    });
  });

  describe("positioning strategy", () => {
    it("should add scroll offset for absolute positioning", () => {
      vi.stubGlobal("scrollX", 50);
      vi.stubGlobal("scrollY", 100);

      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.TopLeft,
        undefined,
        PositioningStrategy.Absolute,
      );
      expect(result.left).toBe(250); // 200 + 50
      expect(result.top).toBe(200); // 100 + 100
    });

    it("should not add scroll offset for fixed positioning", () => {
      vi.stubGlobal("scrollX", 50);
      vi.stubGlobal("scrollY", 100);

      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.TopLeft,
        undefined,
        PositioningStrategy.Fixed,
      );
      expect(result.left).toBe(200);
      expect(result.top).toBe(100);
    });

    it("should default to absolute positioning", () => {
      vi.stubGlobal("scrollX", 30);
      vi.stubGlobal("scrollY", 40);

      const result = calculateAnchorPointCoords(mockRect, AnchorPoint.TopLeft);
      expect(result.left).toBe(230); // 200 + 30
      expect(result.top).toBe(140); // 100 + 40
    });
  });

  describe("combined offset and scroll", () => {
    it("should apply both offset and scroll for absolute positioning", () => {
      vi.stubGlobal("scrollX", 50);
      vi.stubGlobal("scrollY", 100);

      const result = calculateAnchorPointCoords(
        mockRect,
        AnchorPoint.TopLeft,
        { x: 10, y: 20 },
        PositioningStrategy.Absolute,
      );
      expect(result.left).toBe(260); // 200 + 50 + 10
      expect(result.top).toBe(220); // 100 + 100 + 20
    });
  });
});
