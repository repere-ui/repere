/**
 * Match a current path against a page path pattern
 * Supports exact strings, wildcards, and RegExp
 */
export function matchPath(
  currentPath: string,
  pattern: string | RegExp,
): boolean {
  if (pattern instanceof RegExp) {
    return pattern.test(currentPath);
  }

  if (pattern === currentPath) {
    return true;
  }

  // Wildcard support: /foo/* matches /foo/bar, /foo/bar/baz, etc.
  if (pattern.includes("*")) {
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape special regex chars
      .replace(/\*/g, ".*"); // Replace * with .*
    return new RegExp(`^${regexPattern}$`).test(currentPath);
  }

  return false;
}