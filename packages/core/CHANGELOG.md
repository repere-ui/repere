# @repere/core

## 0.2.0

### Minor Changes

- c4e5f0c: Refactor positioning semantics for clarity

  This is a major refactoring of type and function names to better reflect their semantic meaning:

  - `Position` → `AnchorPoint` - More accurately describes points on an element where beacons attach
  - `RenderingStrategy` → `PositioningStrategy` - Better reflects CSS `position` property usage
  - `PositionTracker` → `AnchorPointTracker` - Clarifies that it tracks anchor points on reference elements
  - `calculateBeaconPosition()` → `calculateBeaconAnchor()` - More precise naming
  - `CalculatedBeaconPosition` → `CalculatedBeaconAnchor` - Consistent with above changes
  - `DEFAULT_POSITION` → `DEFAULT_ANCHOR_POINT` - Consistent with anchor point terminology

## 0.1.2

### Patch Changes

- cf01900: When navigating between pages, the trigger callbacks were ignoring the delay. This patch fixes this behaviour.

## 0.1.1

### Patch Changes

- 62615b2: Track delays per callback so anytime we refresh the page, delays will be respected.

## 0.1.0

### Minor Changes

- 7a54131: Add a `delay` API to trigger positioning.
  This is mainly for cases where the trigger’s selector element is animating, which causes miscalculation of the trigger position.
  Previously, the trigger position could be calculated while the selector was still transitioning.

## 0.0.4

### Patch Changes

- d209192: Add missing BeaconState export

## 0.0.3

### Patch Changes

- 69ad75d: Re-add exported dist styles

## 0.0.2

### Patch Changes

- a4aeb83: Rename dist core.css to styles.css

## 0.0.1

### Patch Changes

- f83e5ae: Bumped deps
