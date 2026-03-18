## 2026-03-10 - Visual Refinement: Improving Polygons
### Current Understanding
The user wants to improve the visual quality (specifically polygon counts/model complexity) of the towers ("powers") and enemies. Currently, both use very basic Three.js primitives (boxes, low-segment spheres/cylinders).

### Options Considered
1. **Increase Segments Only:** Simply bump up the segment counts in `sphereGeometry`, `cylinderGeometry`, etc. This is easy but might not "wow" the user.
2. **Compound Geometry:** Build more detailed models by grouping multiple primitives together (e.g., adding barrels to the Gatling tower, adding armor plates to the Tank enemy).
3. **External Models:** Load high-quality GLTF/GLB models. This is harder to manage without assets.
4. **Procedural Detail:** Use the "Game Developer" mindset to add "kitbashed" details using primitives.

### Decision & Rationale
I will go with **Option 2 (Compound Geometry)**. It fits the "KISS" and "DOTI" rules while providing a significant visual upgrade over single primitives. It allows me to stay within the React/R3F environment without needing external asset management for now. I will also increase segment counts to make the curves smoother.

## Project Understanding (for Advanced AI / next agent)
- **Stack:** React 19, TypeScript, Vite, R3F + Drei, Zustand. No ARCHITECTURE.md or STYLE_GUIDE.md in repo.
- **State:** `gameStore.ts` — `screen` (MENU/PLAYING), `runState` (IDLE/PRE_WAVE/WAVE/PAUSED/GAME_OVER), `activeOverlay`, `settings` (persisted to localStorage); `enemies`, `towers`, `path`, `wave` (0 = pre-first); lifecycle: `startNewRun`, `restartRun`, `returnToMenu`, `pauseGame`, `resumeGame`, `loseHealth`.
- **Pathfinding:** `pathfinding.ts` — A* on grid; path recomputed in `Grid.tsx` only on tower add.
- **Enemies:** See [ENEMIES_DATABASE.md](ENEMIES_DATABASE.md). Types Standard, Tank, Flying, Runner, Swarm, Brute. Tank has `armor`. Runner/Swarm = fast, fragile. Flying = beeline; others use path + local avoidance.
- **Towers:** Gatling vs Mortar; each has upgrades (Gatling: default/rapid/pierce; Mortar: default/bigBoom/shrapnel). Global target mode: nearest, closestToGoal, highestHp, lowestHp, fastest. Mortar uses predictive aim (lead time).
- **Remaining gap:** Dynamic path recalculation when enemies get stuck.

## Active Tasks
- [x] Initial Tower diversity (Gatling vs Mortar/AoE)
- [x] Wave Manager & Scaling Difficulty
- [x] Basic Local Avoidance
- [x] Implement Predictive Aiming (Mortar)
- [x] Advanced Targeting Priorities (all 5 modes in HUD)
- [x] New Enemy Types (Flying, Tank, Runner, Swarm, Brute)
- [x] Tower upgrades (Rapid/Pierce, Big Boom/Shrapnel) + HUD
- [x] Improve 3D Models (Polygons) for Towers & Enemies
- [x] Implement Post-processing (Bloom, Vignette, Tactical Fog)
- [x] Implement Motion UI (Framer Motion transitions for HUD)
- [x] Improve Enemy Visuals (Animated arms/legs, walk cycle)
- [ ] Create Gallery Component (3D previews of towers/enemies)
- [ ] Add Gallery Button to Main Menu
- [ ] Implement Physics-based Enemy Death (Cannon scrap/ragdoll)
- [ ] Dynamic Path Recalculation (Edge cases)

## Blocked Items
- None.

## Recent Context (last 5 actions)
1. Enemy limbs: Added minimal biped legs + arms (Standard/Runner), spider legs (Swarm), stumpy legs + arms (Brute), piston legs (Tank). Walk-cycle animation synced to speed. Flying unchanged.
2. Environment design: `src/constants/environment.ts` (palette, lighting, fog, ground, obstacles, pylons, hologram, path preview, VFX timing, lerpColorHex, getFogArgs); ENV_POST for bloom/vignette; GameScene wired to env; DOCS/ENVIRONMENT_DESIGN.md + SUMMARY link.
3. Map 2 "The Gauntlet": 14x14, obstacles (walls), builtBy: "You" in MapSelector; obstacles in pathfinding/Grid; MAPS_DATABASE updated.
4. Map 1: doubled enemies via enemyCountMultiplier: 2; getEnemyCountForWave(wave, mult); docs: MAPS_DATABASE wave layout, ENEMIES_DATABASE per-map note.
5. SBOM improved (categories, versions, recommended additions); VISUAL_UX_STACK.md added (postprocessing, motion, react-spring/three, leva, QoL ideas).
4. Swarm/Brute visuals in Enemy.tsx; MAPS_DATABASE.md; ENEMIES_DATABASE.md updated; MapSelector link in SUMMARY; build fixed (unused vars).
5. Maps database: `src/data/maps_database.ts` — Map 1 "The First Line"; MapSelector on Play; startNewRun(mapId).
6. Enemies database: `src/data/enemies_database.ts` — ENEMY_DEFINITIONS, WAVE_CONFIG, getEnemyCountForWave, rollEnemyTypeForWave, computeEnemyStats; goldReward per type; spawn weights and minWave.
7. Visual Refinement Initiation: User requested higher polygon counts/better models for "powers" (towers) and enemies.
8. Code Analysis: Inspected `Tower.tsx` and `Enemy.tsx`; confirmed use of basic primitives.
9. Visual Tech Stack Expansion: Installed `motion`, `@react-three/postprocessing`, `@react-three/cannon`, and `leva`. Updated SBOM and established a roadmap for "sicker" visuals.
10. Integrated Bloom, Vignette, and Scanning Line VFX. Overhauled HUD and Narrator with tactical theme and Framer Motion.
11. Gallery & Enemy Upgrade Initiation: User requested improved enemy visuals and a Gallery button on the main menu.
12. Plan: Implement compound geometries for better visual detail while maintaining the low-poly humorous aesthetic.
13. Large Gameplay Upgrade: extended gameStore with TargetMode, tower upgrades, Runner enemy, armor; Tower.tsx target modes + predictive aim + upgrade stats; Enemy.tsx Runner visuals; death particle colors by type; HUD target + upgrade selectors.
14. Build verified (npm run build succeeds).
15. Implemented advanced targeting in `Tower.tsx` (Gatling targets closest, Mortar targets highest HP).
16. Fixed and visually improved laser/projectile traces using `@react-three/drei`'s `Line` component.
17. Implemented new enemy types (Flying and Tank) in `gameStore.ts` and `Enemy.tsx`.

## Compacted History
- Project initialized and requirements documented.
- Scaffoled Vite React+TS project and installed dependencies.
- Implemented pathfinding, core movement, combat, and VFX.