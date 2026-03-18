# Visual & UX Stack — Core Infrastructure

> **Status:** ✅ Core Post-processing, Motion, and Tuning layers installed.

---

## 1. Post-Processing (Atmosphere & Tactical Feel)
**Status:** ✅ Active (`@react-three/postprocessing`)

- **Bloom:** Essential for "Pulse-Pylons" and tower lasers.
- **Vignette:** Grounding the scene, focusing the user.
- **Tone Mapping:** Standard Three.js `ACESFilmicToneMapping` for high dynamic range colors.
- **SSAO:** (To be implemented) Adds contact shadows to the tactical grid.

## 2. Motion & Interface (Fluid Deployment)
**Status:** ✅ Active (`motion` / Framer Motion)

- **UI Transitions:** Smoothly slide in HUD elements, Narrator panels.
- **Gestures:** Hover scaling, tactical button clicks.
- **Layout:** `AnimatePresence` for dynamic tower switching menus.

## 3. Physical Intelligence
**Status:** ✅ Active (`@react-three/cannon`)

- **Impacts:** Projectiles can now have physical callbacks (not just raycasts).
- **Chaos:** (Planned) Enemies can have physics components for "ragdoll" or "knockback" effects.
- **Scrap Simulation:** Defeated enemies can spawn physical "scrap" objects that bounce and settle.

## 4. Real-time Tuning (Performance/Visuals)
**Status:** ✅ Active (`leva`)

- **Developer HUD:** Tweak emission intensities, damage colors, and wave speeds on the fly.
- **Usage:** Only visible in development; strictly managed for design iterations.

---

## 🛑 Roadmap: Next Steps (The "Sicker" Stuff)

### A. Advanced VFX
- [ ] **Custom Shaders:** A "scanning" grid line that passes through the world.
- [ ] **Particle Buffs:** Upgraded projectiles with custom sparks and trails.
- [ ] **Screen Shake 2.0:** Logic that correlates intensity with damage taken.

### B. UX / QoL Refinements
- [ ] **Haptic Visuals:** Mouse cursor changes based on tile validity (beyond color change).
- [ ] **Deploy Pre-viz:** Animated holographic scaling when hovering a buildable tile.
- [ ] **Dynamic Audio:** Music that scales in tempo/complexity as enemies approach the goal.

### C. Advanced Input
- [ ] **react-use-gesture:** To be added for smooth camera panning and pinch-to-zoom on mobile/trackpads.
