# Changelog

> **Important Rule:** NEVER delete existing documentation in the `DOCS/` folder. Only append or compact. Do not replace or delete information. Continue to include and add content to this documentation to maintain a complete project history.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Visual Depth Overhaul**: Integrated `@react-three/postprocessing` with **Bloom** (glowing tactical elements) and **Vignette** (cinematic grounding).
- **Tactical UI System**: Complete overhaul of HUD and Narrator using glassmorphism, glowing accents, and `Orbitron` typography.
- **Motion UI**: Replaced static UI animations with declarative **Framer Motion** (`motion`) transitions, including spring physics and `AnimatePresence` for dynamic panels.
- **Physics Layer**: Integrated `@react-three/cannon` to prepare for physical scrap and ragdoll effects.
- **Atmospheric Lighting**: Darkened the world, added tactical fog, and high-emissive "Pulse-Pylons" for spawn/goal points.
- **Grid VFX**: Added a dynamic "Scanning Line" sweep and localized hover lights for better spatial feedback on the grid.
- **Tactical Comms Link**: Replaced the cowboy narrator with a sleek AI-avatar interface featuring real-time comms text.
- **Enemies database**: `src/data/enemies_database.ts` — central definitions for enemy types (Standard, Runner, Flying, Tank), wave config (count, spawn interval), stats computation, and weighted spawn logic.
- **Menu/Pause/Settings**: Game boots to main menu; pause on Esc or HUD button; PauseOverlay (Resume, Settings, Restart, Return to Menu); SettingsPanel (Mute, Volume, Screen Shake, Particles, Floating Text, Path Preview, Reduced Motion); GameOverOverlay (Retry, Return to Menu); Settings persisted to localStorage.
- **Target modes**: Global tower targeting — Nearest, Closest to goal, Highest HP, Lowest HP, Fastest (HUD selector).
- **Predictive aiming**: Mortar leads moving targets by speed and direction to goal.
- **Tower upgrades**: Gatling (Default, Rapid, Pierce); Mortar (Default, Big Boom, Shrapnel). Chosen at placement via HUD.
- **Runner enemy**: Fast, low-HP path-following type; spawns from wave 2.
- **Tank armor**: Direct and AoE damage reduced by 50% for Tank type; death/particle colors by enemy type.
- **Combat juice**: Tracer color varies by tower type and upgrade; death particles tinted by enemy type.
- **SoundFX System**: Procedural audio manager using Web Audio API for zero-asset sound effects (lasers, impacts, UI).
- **Visual Refinement**: Upgraded 3D models for all towers and enemies with compound geometries and higher polygon counts.
    - Gatling Tower: Multi-barrel assembly and tiered pedestal.
    - Mortar Tower: Detailed turret ball and tilting cannon barrel.
    - Tank Enemy: Armor plating and tread visuals.
    - Flying Enemy: Wing structures and nose cone.
    - Standard/Runner Enemy: Antenna and eye details.
- **Main Menu**: Interactive title screen to manage game start and audio unlocking.
- **Global State**: `screen` state in Zustand for switching between Menu and Playing modes.
- **Local Avoidance**: Enemies now push away from each other slightly to avoid perfect overlapping.
- **Visual Placement Indicators**: Holographic tower preview on the grid with validity coloring (pink/red).
- **Wave Management**: Dynamic scaling difficulty and spawning logic.
- **V VFX**: Particle explosions on death, floating combat text, and screen shake.

### Changed
- `App.tsx`: Now conditionally renders based on game state.
- `Grid.tsx`: Integrated sound effects and holographic previews.
- `Tower.tsx`: Integrated laser firing sounds and recoil animations.
- `Enemy.tsx`: Integrated impact sounds and hit-flash VFX.

### Fixed
- `Grid.tsx`: Resolved `ReferenceError: useState is not defined` by adding missing import.

## [0.1.0] - 2026-03-10

### Added
- Initial project scaffold (Vite + React + TS).
- Core A* Pathfinding utility.
- Grid-based tower placement logic.
- Basic Enemy movement and combat loop.
- "Tour Guide Narrator" reactive UI.
- Zustand global state management.
