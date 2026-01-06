---
"@repere/react": minor
---

Update React package to use new positioning semantics from `@repere/core`

Updated all React components, hooks, and utilities to align with the core package refactoring:

- `useBeaconPosition` → `useBeaconAnchor` - Renamed hook with updated parameters
- All component props updated: `position` → `anchorPoint`, `calculatedPosition` → `calculatedAnchor`
- Context values updated to use new naming conventions
- CSS attribute updated: `data-position` → `data-anchor-point`
