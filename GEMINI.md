# Project Overview

This is a top-down 3D tower defense game built with **React**, **TypeScript**, and **React Three Fiber (R3F)**, bundled with **Vite**.

The game features a core "mazing" mechanic: players place towers on a 3D grid, dynamically altering the paths that enemies take. It implements an A* pathfinding algorithm to calculate enemy routes and validate tower placement (preventing the player from completely blocking the path).

State management is handled via **Zustand**.

## Tone and Vision Discrepancy (Important!)

*   **Current Active State (Humorous/Cartoon):** The game currently implements a low-poly cartoon aesthetic with a humorous tone. It features a "Tour Guide Narrator" UI overlay, and enemies display goofy chat bubbles upon taking damage or dying. **Unless specified otherwise, maintain this lighthearted, humorous approach.**
*   **Long-Term Vision (Ironhold: Siege Protocols):** A `whitepaper.md` exists detailing an ambitious, dark, "dieselpunk cosmic horror" refactor called *Ironhold: Siege Protocols*. Do not implement these systems unless explicitly instructed to shift the game towards the Ironhold design.

# Core Mechanics

*   **Mazing:** Towers act as obstacles on the grid.
*   **Pathfinding:** Enemies use A* to find the shortest path from start to end. The algorithm must always ensure a valid path exists before allowing a tower to be placed.
*   **VFX & Feedback:** The game relies on 3D floating text for damage numbers/death quotes and particle explosions for visual feedback.

# Architecture & Component Structure

*   **State Management (`src/store/gameStore.ts`):** Global game state (health, gold, current wave, grid size, placed towers, enemy data) is managed via Zustand. 
    *   *Performance Rule:* High-frequency updates, such as precise 3D enemy positions, are stored in mutable objects (e.g., `export const enemyPositions: Record<string, Vector3> = {};`) alongside the store to avoid triggering constant React re-renders.
*   **3D Rendering (`src/components/`):** Handled via React Three Fiber and `@react-three/drei`. 3D objects are placed inside a `<Canvas>` in `src/components/GameScene.tsx`.
*   **VFX (`src/components/VFX/`):** Contains particle systems and 3D floating text logic.
*   **UI (`src/components/UI/`):** 2D DOM overlays (HUD, Main Menu, NarratorOverlay, WaveManager) are strictly separated from the 3D Canvas.
*   **Pathfinding (`src/utils/pathfinding.ts`):** The A* algorithm logic is kept strictly isolated from UI rendering.

# Documentation & Rules

*   **DOCS Directory Rule:** NEVER delete existing documentation in the `DOCS/` folder. Only append or compact. Do not replace or delete information. Continue to include and add content to this documentation to maintain a complete project history.
*   **TypeScript:** Strict typing is enforced. Make sure to define interfaces/types for game state and props.
*   **Platform:** Use forward slashes `/` for paths in code. Remember Windows compatibility for any shell scripts.

# Building and Running

The project relies on standard npm scripts defined in `package.json`. You can also use the included `launch.bat` script on Windows to quickly start the server.

*   **Install dependencies:** `npm install`
*   **Start development server:** `npm run dev` (or double-click `launch.bat` on Windows)
*   **Build for production:** `npm run build`
*   **Preview production build:** `npm run preview`
*   **Run linter:** `npm run lint`