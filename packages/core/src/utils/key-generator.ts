/**
 * Default beacon key generator
 * Always global - once dismissed, dismissed everywhere
 */
export function defaultBeaconKeyGenerator(beaconId: string): string {
  return `repere:${beaconId}`;
}

/**
 * Generate a stable hash for complex objects
 */
export function hashObject(obj: unknown): string {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
