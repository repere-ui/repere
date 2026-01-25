import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Beacon } from "../types/beacon";
import type { Page } from "../types/config";
import type { BeaconStore } from "../types/store";
import { BeaconManager } from "./BeaconManager";

const createMockStore = (): BeaconStore => ({
  isDismissed: vi.fn().mockReturnValue(false),
  dismiss: vi.fn(),
  reset: vi.fn(),
  resetAll: vi.fn(),
  getAll: vi.fn().mockReturnValue([]),
});

const createBeacon = (id: string): Beacon => ({
  id,
  selector: `#${id}`,
  popover: {},
});

const createPage = (
  id: string,
  path: string | RegExp | ((pathname: string) => boolean),
  beacons: Beacon[] = [],
): Page => ({
  id,
  path,
  beacons,
});

describe("BeaconManager", () => {
  let store: BeaconStore;
  let manager: BeaconManager;

  beforeEach(() => {
    store = createMockStore();
    manager = new BeaconManager(store);
  });

  describe("findMatchingPages", () => {
    it("should find pages with exact path match", () => {
      const pages = [
        createPage("home", "/home"),
        createPage("about", "/about"),
        createPage("contact", "/contact"),
      ];

      const result = manager.findMatchingPages(pages, "/about");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("about");
    });

    it("should find pages with wildcard pattern", () => {
      const pages = [
        createPage("users", "/users/*"),
        createPage("home", "/home"),
      ];

      const result = manager.findMatchingPages(pages, "/users/123");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("users");
    });

    it("should find pages with RegExp pattern", () => {
      const pages = [
        createPage("users", /^\/users\/\d+$/),
        createPage("home", "/home"),
      ];

      const result = manager.findMatchingPages(pages, "/users/456");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("users");
    });

    it("should find pages with function pattern", () => {
      const pages = [
        createPage("dynamic", (path) => path.startsWith("/api")),
        createPage("home", "/home"),
      ];

      const result = manager.findMatchingPages(pages, "/api/v1/users");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("dynamic");
    });

    it("should return multiple matching pages", () => {
      const pages = [
        createPage("all", "*"),
        createPage("users", "/users/*"),
        createPage("home", "/home"),
      ];

      const result = manager.findMatchingPages(pages, "/users/123");

      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toContain("all");
      expect(result.map((p) => p.id)).toContain("users");
    });

    it("should return empty array when no pages match", () => {
      const pages = [
        createPage("home", "/home"),
        createPage("about", "/about"),
      ];

      const result = manager.findMatchingPages(pages, "/nonexistent");

      expect(result).toHaveLength(0);
    });
  });

  describe("getActiveBeacons", () => {
    it("should return beacons from matching page", async () => {
      const beacons = [createBeacon("beacon-1"), createBeacon("beacon-2")];
      const pages = [createPage("home", "/home", beacons)];

      const result = await manager.getActiveBeacons(pages, "/home");

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("beacon-1");
      expect(result[1].id).toBe("beacon-2");
    });

    it("should filter out dismissed beacons", async () => {
      const beacons = [createBeacon("beacon-1"), createBeacon("beacon-2")];
      const pages = [createPage("home", "/home", beacons)];

      vi.mocked(store.isDismissed).mockImplementation(
        (id) => id === "beacon-1",
      );

      const result = await manager.getActiveBeacons(pages, "/home");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("beacon-2");
    });

    it("should collect beacons from multiple matching pages", async () => {
      const pages = [
        createPage("all", "*", [createBeacon("global-beacon")]),
        createPage("home", "/home", [createBeacon("home-beacon")]),
      ];

      const result = await manager.getActiveBeacons(pages, "/home");

      expect(result).toHaveLength(2);
      expect(result.map((b) => b.id)).toContain("global-beacon");
      expect(result.map((b) => b.id)).toContain("home-beacon");
    });

    it("should skip duplicate beacon IDs", async () => {
      const pages = [
        createPage("page1", "*", [createBeacon("shared-beacon")]),
        createPage("page2", "/home", [createBeacon("shared-beacon")]),
      ];

      const result = await manager.getActiveBeacons(pages, "/home");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("shared-beacon");
    });

    it("should return empty array when no pages match", async () => {
      const pages = [createPage("home", "/home", [createBeacon("beacon-1")])];

      const result = await manager.getActiveBeacons(pages, "/about");

      expect(result).toHaveLength(0);
    });

    it("should handle async isDismissed check", async () => {
      const beacons = [createBeacon("beacon-1")];
      const pages = [createPage("home", "/home", beacons)];

      vi.mocked(store.isDismissed).mockResolvedValue(false);

      const result = await manager.getActiveBeacons(pages, "/home");

      expect(result).toHaveLength(1);
    });
  });

  describe("getStore", () => {
    it("should return the store instance", () => {
      expect(manager.getStore()).toBe(store);
    });
  });

  describe("debug mode", () => {
    it("should log when debug is enabled", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const debugManager = new BeaconManager(store, { debug: true });
      const pages = [createPage("home", "/home")];

      debugManager.findMatchingPages(pages, "/home");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("should not log when debug is disabled", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const pages = [createPage("home", "/home")];

      manager.findMatchingPages(pages, "/home");

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
