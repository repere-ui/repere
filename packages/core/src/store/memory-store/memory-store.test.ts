import { beforeEach, describe, expect, it } from "vitest";
import { MemoryStore } from "./memory-store";

describe("MemoryStore", () => {
  let store: MemoryStore;

  beforeEach(() => {
    store = new MemoryStore();
  });

  describe("isDismissed", () => {
    it("should return false for unknown beacon", () => {
      expect(store.isDismissed("unknown-beacon")).toBe(false);
    });

    it("should return true for dismissed beacon", () => {
      store.dismiss("beacon-1");
      expect(store.isDismissed("beacon-1")).toBe(true);
    });

    it("should return false for non-dismissed beacon after another is dismissed", () => {
      store.dismiss("beacon-1");
      expect(store.isDismissed("beacon-2")).toBe(false);
    });
  });

  describe("dismiss", () => {
    it("should mark beacon as dismissed", () => {
      store.dismiss("beacon-1");
      expect(store.isDismissed("beacon-1")).toBe(true);
    });

    it("should be idempotent", () => {
      store.dismiss("beacon-1");
      store.dismiss("beacon-1");
      expect(store.isDismissed("beacon-1")).toBe(true);
    });

    it("should allow dismissing multiple beacons", () => {
      store.dismiss("beacon-1");
      store.dismiss("beacon-2");
      store.dismiss("beacon-3");

      expect(store.isDismissed("beacon-1")).toBe(true);
      expect(store.isDismissed("beacon-2")).toBe(true);
      expect(store.isDismissed("beacon-3")).toBe(true);
    });
  });

  describe("reset", () => {
    it("should reset dismissed state for a beacon", () => {
      store.dismiss("beacon-1");
      store.reset("beacon-1");
      expect(store.isDismissed("beacon-1")).toBe(false);
    });

    it("should not affect other beacons", () => {
      store.dismiss("beacon-1");
      store.dismiss("beacon-2");
      store.reset("beacon-1");

      expect(store.isDismissed("beacon-1")).toBe(false);
      expect(store.isDismissed("beacon-2")).toBe(true);
    });

    it("should handle resetting unknown beacon", () => {
      store.reset("unknown-beacon");
      expect(store.isDismissed("unknown-beacon")).toBe(false);
    });
  });

  describe("resetAll", () => {
    it("should reset all dismissed states", () => {
      store.dismiss("beacon-1");
      store.dismiss("beacon-2");
      store.dismiss("beacon-3");

      store.resetAll();

      expect(store.isDismissed("beacon-1")).toBe(false);
      expect(store.isDismissed("beacon-2")).toBe(false);
      expect(store.isDismissed("beacon-3")).toBe(false);
    });

    it("should work on empty store", () => {
      store.resetAll();
      expect(store.getAll()).toHaveLength(0);
    });
  });

  describe("getAll", () => {
    it("should return empty array for new store", () => {
      expect(store.getAll()).toEqual([]);
    });

    it("should return all beacon states", () => {
      store.dismiss("beacon-1");
      store.dismiss("beacon-2");

      const states = store.getAll();

      expect(states).toHaveLength(2);
      expect(states).toContainEqual({ id: "beacon-1", isDismissed: true });
      expect(states).toContainEqual({ id: "beacon-2", isDismissed: true });
    });

    it("should return current state after modifications", () => {
      store.dismiss("beacon-1");
      store.dismiss("beacon-2");
      store.reset("beacon-1");

      const states = store.getAll();

      expect(states).toHaveLength(1);
      expect(states).toContainEqual({ id: "beacon-2", isDismissed: true });
    });

    it("should return a copy of the state", () => {
      store.dismiss("beacon-1");

      const states1 = store.getAll();
      store.dismiss("beacon-2");
      const states2 = store.getAll();

      expect(states1).toHaveLength(1);
      expect(states2).toHaveLength(2);
    });
  });
});
