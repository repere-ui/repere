# @repere/react

## 0.3.0

### Minor Changes

- c4e5f0c: Update React package to use new positioning semantics from `@repere/core`

  Updated all React components, hooks, and utilities to align with the core package refactoring:

  - `useBeaconPosition` → `useBeaconAnchor` - Renamed hook with updated parameters
  - All component props updated: `position` → `anchorPoint`, `calculatedPosition` → `calculatedAnchor`
  - Context values updated to use new naming conventions
  - CSS attribute updated: `data-position` → `data-anchor-point`

### Patch Changes

- Updated dependencies [c4e5f0c]
  - @repere/core@0.2.0

## 0.2.2

### Patch Changes

- Updated dependencies [cf01900]
  - @repere/core@0.1.2

## 0.2.1

### Patch Changes

- 4144719: Move @repere/core from devDependency to dependency list
- Updated dependencies [62615b2]
  - @repere/core@0.1.1

## 0.2.0

### Minor Changes

- 7a54131: Add a `delay` API to trigger positioning.
  This is mainly for cases where the trigger’s selector element is animating, which causes miscalculation of the trigger position.
  Previously, the trigger position could be calculated while the selector was still transitioning.

## 0.1.1

### Patch Changes

- b17b405: Export @repere/core types, Animation and Position enums

## 0.1.0

### Minor Changes

- 81ee3d2: @repere/core is no longer a peerDependency and is now a dependency of @repere/react

### Patch Changes

- 81ee3d2: fix deprecated assetinfo names key in vite.config

## 0.0.3

### Patch Changes

- Updated dependencies [69ad75d]
  - @repere/core@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [a4aeb83]
  - @repere/core@0.0.2

## 0.0.1

### Patch Changes

- f83e5ae: Bumped deps
- Updated dependencies [f83e5ae]
  - @repere/core@0.0.1
