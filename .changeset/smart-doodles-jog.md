---
"@repere/react": minor
"@repere/core": minor
---

Add a `delay` API to trigger positioning.
This is mainly for cases where the trigger’s selector element is animating, which causes miscalculation of the trigger position.
Previously, the trigger position could be calculated while the selector was still transitioning.

