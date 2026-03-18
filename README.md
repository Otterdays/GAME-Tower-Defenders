# Tower Defense Game (Ironhold: Siege Protocols - Prototype)

A top-down 3D tower defense game built with React Three Fiber, featuring a "mazing" mechanic where players place towers to build the path for incoming enemies. Features a low-poly cartoon aesthetic and a humorous Tour Guide Narrator.

**Note:** This is an active prototype building towards the vision outlined in the `whitepaper.md`. Please refer to the whitepaper for full design systems, narrative integration, and advanced mechanics.

## Important Rule
**NEVER delete existing documentation in the `DOCS/` folder. Only append or compact. Do not replace or delete information. Continue to include and add content to all documentation to maintain a complete project history.**

## Quick Start

1. Ensure you have Node.js installed.
2. Double-click `launch.bat` (Windows) or run `npm run dev` in your terminal.
3. Open `http://localhost:5173` in your browser.

## Features (Current)
- Interactive 3D grid with tower placement.
- A* Pathfinding that recalculates on the fly.
- Economy system (Gold to build towers, rewards on enemy defeat).
- Basic Tower combat (auto-targeting, lasers, HP system).
- "Tour Guide Narrator" reactive UI overlay.
- Dynamic Wave Manager with scaling difficulty.
- VFX: Particle Explosions, floating damage numbers, screen shake, hit flashes.
- SoundFX: Procedural audio for lasers, impacts, and UI via Web Audio API.
- Main Menu: Title screen with interactive audio unlocking.
- Local avoidance for enemies to prevent overlapping.

## Roadmap & Granular Tasks

### Phase 1: Foundation (Completed)
- [x] Basic React Three Fiber Scene & Grid.
- [x] A* Pathfinding and path validation.
- [x] Basic Tower and Enemy entities.
- [x] Global State Management (Zustand).

### Phase 2: VFX & Game Feel (Completed)
- **Character & Animation Polish:**
  - [x] Squash/stretch animations to enemies when moving.
  - [x] Hit-flash (turn white/red briefly) when taking damage.
  - [x] Particle explosions upon enemy defeat.
  - [x] Floating damage numbers and animated death quotes in 3D space.
- **UI & Sound Feel:**
  - [x] Main Menu screen with start functionality.
  - [x] Procedural SoundFX system (no external assets needed).
  - [x] Screen shake effect when an enemy reaches the base (health lost).
  - [x] Bouncy, physics-based entry/exit animations for the Narrator UI.
  - [x] Visual placement indicators (hologram of tower before placement, red if invalid).
- **Environment & Towers:**
  - [x] Tower recoil animations upon firing.
  - [x] Wave Manager UI with scaling difficulty and countdowns.

### Phase 3: NPC Intelligence & Advanced Systems (Active)
- **Enemy & Tower Variety:**
  - [x] Local avoidance (enemies spread out slightly instead of perfectly overlapping).
  - [x] Initial Tower diversity (Gatling vs. Mortar/AoE).
  - [ ] New enemy types (e.g., Flying enemies that ignore paths, Tank enemies).
- **Combat Logic:**
  - [ ] Predictive aiming for fast-moving enemies.
  - [ ] Advanced targeting priorities (Closest to Base, Highest HP, Lowest HP).
  - [ ] Dynamic path recalculation if enemies get "trapped".

### Phase 4: The Ironhold Shift - Resource & Economy Evolution (Whitepaper)
- [ ] **Multi-Currency System:** Scrap (basic), Aether (advanced), Memory Shards (meta).
- [ ] **Command Points:** Static generation rate to limit simultaneous tower count.
- [ ] **Tower Recycling:** Salvage scrap from destroyed towers or enemies.

### Phase 5: The Arsenal Expansion - Tower Classification & Synergies (Whitepaper)
- [ ] **Tower Hybridization:** Adjacent tower synergies (e.g., Chem + Arc = Electro-Corrosion).
- [ ] **Support & Trap Classes:** Relay Beacons, Repair Drone Bays, Mine Layers.
- [ ] **Tiered Upgrades:** Branching final evolutions (Tier 2/3) for all tower types.

### Phase 6: The Null Threat - Factions & Advanced Bestiary (Whitepaper)
- [ ] **The Null Faction:** Glitch Stalkers (teleporting), Void Titans (distortion fields).
- [ ] **The Iron Legion:** Scrap Walkers (swarms), Steam Tanks (crush barriers).
- [ ] **Enemy Modifiers:** Random elite auras (Phased, Regenerating, Berserker).

### Phase 7: Reality Fracture - Biomes & Environmental Mechanics (Whitepaper)
- [ ] **Map Biomes:** The Rust Coast (tides), Hollow City (electrical grids), Flesh Forest (organic walls).
- [ ] **Dynamic Objectives:** Extraction (escort), Siege (counter-attack), Fracture (multi-map).

### Phase 8: Strategic Command - Campaign & Meta-Progression (Whitepaper)
- [ ] **Ironhold Chronicles:** 30-mission campaign with branching world-map paths.
- [ ] **Commander Profiles:** Passive bonuses and achievement-based unlocks.
- [ ] **Endgame Content:** The Infinite Siege, Ironman Protocol, and Daily Operations.

## Tech Stack
- React 19
- TypeScript
- Vite
- Three.js & React Three Fiber & Drei
- Zustand (State Management)