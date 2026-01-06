---
"@repere/core": minor
---

Refactor positioning semantics for clarity

This is a major refactoring of type and function names to better reflect their semantic meaning:

- `Position` → `AnchorPoint` - More accurately describes points on an element where beacons attach
- `RenderingStrategy` → `PositioningStrategy` - Better reflects CSS `position` property usage
- `PositionTracker` → `AnchorPointTracker` - Clarifies that it tracks anchor points on reference elements
- `calculateBeaconPosition()` → `calculateBeaconAnchor()` - More precise naming
- `CalculatedBeaconPosition` → `CalculatedBeaconAnchor` - Consistent with above changes
- `DEFAULT_POSITION` → `DEFAULT_ANCHOR_POINT` - Consistent with anchor point terminology
