/**
 * Match a current path against a page path pattern
 * Supports exact strings, wildcards, and RegExp
 */
export function matchPath(
  currentPath: string,
  pattern: string | RegExp,
): boolean {
  // RegExp matching
  if (pattern instanceof RegExp) {
    return pattern.test(currentPath);
  }

  // Exact match
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

/**
 * Normalize path (remove trailing slash, ensure leading slash)
 */
export function normalizePath(path: string): string {
  let normalized = path.trim();

  // Remove trailing slash (except for root)
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  // Ensure leading slash
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }

  return normalized;
}
