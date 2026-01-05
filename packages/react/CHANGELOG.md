# @repere/react

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
