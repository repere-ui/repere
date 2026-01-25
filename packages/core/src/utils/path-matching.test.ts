import { describe, expect, it } from "vitest";
import { matchPath } from "./path-matching";

describe("matchPath", () => {
  describe("exact string matching", () => {
    it("should match exact paths", () => {
      expect(matchPath("/home", "/home")).toBe(true);
      expect(matchPath("/about", "/about")).toBe(true);
      expect(matchPath("/users/123", "/users/123")).toBe(true);
    });

    it("should not match different paths", () => {
      expect(matchPath("/home", "/about")).toBe(false);
      expect(matchPath("/users", "/users/123")).toBe(false);
      expect(matchPath("/users/123", "/users")).toBe(false);
    });

    it("should be case-sensitive", () => {
      expect(matchPath("/Home", "/home")).toBe(false);
      expect(matchPath("/HOME", "/home")).toBe(false);
    });
  });

  describe("wildcard matching", () => {
    it("should match single wildcard at the end", () => {
      expect(matchPath("/users/123", "/users/*")).toBe(true);
      expect(matchPath("/users/abc", "/users/*")).toBe(true);
      expect(matchPath("/users/123/edit", "/users/*")).toBe(true);
    });

    it("should not match when path does not start with pattern prefix", () => {
      expect(matchPath("/admin/users", "/users/*")).toBe(false);
      expect(matchPath("/home", "/users/*")).toBe(false);
    });

    it("should match wildcard in the middle", () => {
      expect(matchPath("/users/123/edit", "/users/*/edit")).toBe(true);
      expect(matchPath("/users/abc/edit", "/users/*/edit")).toBe(true);
    });

    it("should match multiple wildcards", () => {
      expect(matchPath("/a/b/c/d", "/a/*/c/*")).toBe(true);
      expect(matchPath("/users/123/posts/456", "/users/*/posts/*")).toBe(true);
    });

    it("should match root wildcard", () => {
      expect(matchPath("/anything", "/*")).toBe(true);
      expect(matchPath("/", "/*")).toBe(true);
      expect(matchPath("/deep/nested/path", "/*")).toBe(true);
    });

    it("should handle wildcard-only pattern", () => {
      expect(matchPath("/home", "*")).toBe(true);
      expect(matchPath("anything", "*")).toBe(true);
    });
  });

  describe("RegExp matching", () => {
    it("should match using RegExp patterns", () => {
      expect(matchPath("/users/123", /^\/users\/\d+$/)).toBe(true);
      expect(matchPath("/users/abc", /^\/users\/\d+$/)).toBe(false);
    });

    it("should match partial patterns", () => {
      expect(matchPath("/users/123/edit", /\/users\/\d+/)).toBe(true);
    });

    it("should support case-insensitive flag", () => {
      expect(matchPath("/Home", /^\/home$/i)).toBe(true);
      expect(matchPath("/HOME", /^\/home$/i)).toBe(true);
    });

    it("should support complex patterns", () => {
      expect(matchPath("/api/v1/users", /^\/api\/v\d+\/\w+$/)).toBe(true);
      expect(matchPath("/api/v2/posts", /^\/api\/v\d+\/\w+$/)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty paths", () => {
      expect(matchPath("", "")).toBe(true);
      expect(matchPath("", "/")).toBe(false);
    });

    it("should handle special regex characters in string patterns", () => {
      expect(matchPath("/path.with.dots", "/path.with.dots")).toBe(true);
      expect(matchPath("/path+plus", "/path+plus")).toBe(true);
      expect(matchPath("/path?query", "/path?query")).toBe(true);
    });

    it("should escape special characters when using wildcards", () => {
      expect(matchPath("/test.page/123", "/test.page/*")).toBe(true);
      expect(matchPath("/testXpage/123", "/test.page/*")).toBe(false);
    });
  });
});
