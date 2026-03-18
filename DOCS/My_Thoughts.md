## 2026-03-10 - Visual Polish & Gallery Feature
### Current Understanding
The core tactical visuals (post-processing, HUD, environment) are in a great place. Now we need to focus on individual unit fidelity and "lore" presentation via a Gallery.

### Options Considered
- **Enemy Visuals**: Just increase polygons vs. adding compound animated parts (rotating fans, bobbing bits).
- **Gallery**: 2D Image gallery vs. Interactive 3D Model viewer.

### Decision & Rationale
- **Enemy Visuals**: Add animated compound geometries. For example, the Flying enemy will have rotating rotors, and the Tank will have shifting armor plates. This adds "life" to the units beyond just moving.
- **Gallery**: Interactive 3D Model viewer. Since we're in R3F, creating a "Museum" scene for the Gallery is straightforward and adds massive "premium" value. I'll use a separate Canvas for the Gallery to allow for custom lighting and smooth rotation/zoom without affecting the game scene.
