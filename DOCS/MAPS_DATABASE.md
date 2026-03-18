# Maps Database

> **Source:** `src/data/maps_database.ts`  
> **Last Updated:** March 10, 2026

Central reference for map layouts. Each map defines grid size, start point, and end point. The map selector on the main menu (Play button) lets players choose which map to play.

---

## Map 1: The First Line

| Field      | Value   |
|-----------|---------|
| id        | `map_1` |
| name      | The First Line |
| order     | 1       |
| gridSize  | 10      |
| startPoint| (0, 0)  |
| endPoint  | (9, 9)  |
| enemyCountMultiplier | 2 |

**Description:** Classic corner-to-corner. Enemies spawn at top-left, path to bottom-right. Players place towers to maze the path.

### Wave Layout (Map 1 — 2× enemies)

| Wave | Enemy Count | Spawn Interval |
|------|-------------|----------------|
| 1    | 12          | 2000 ms        |
| 2    | 16          | 2000 ms        |
| 3    | 18          | 2000 ms        |
| 5    | 24          | 2000 ms        |
| 10   | 40          | 2000 ms        |

*Formula: `floor((5 + wave * 1.5) * 2)`*

---

## Map 2: The Gauntlet

| Field      | Value   |
|-----------|---------|
| id        | `map_2` |
| name      | The Gauntlet |
| order     | 2       |
| gridSize  | 14      |
| startPoint| (0, 0)  |
| endPoint  | (13, 13)|
| enemyCountMultiplier | 1.5 |
| builtBy   | You     |

**Description:** Larger battlefield with obstacles. Path winds through the ruins. Static obstacles (vertical wall, horizontal segments) force a longer route.

**Obstacles:** Vertical wall at x=6 (z 4–9); horizontal wall at z=8 (x 8–12); block at z=6 (x 3–5).

### Wave Layout (Map 2 — 1.5× enemies)

| Wave | Enemy Count | Spawn Interval |
|------|-------------|----------------|
| 1    | 9           | 2000 ms        |
| 2    | 12          | 2000 ms        |
| 5    | 18          | 2000 ms        |
| 10   | 30          | 2000 ms        |

*Formula: `floor((5 + wave * 1.5) * 1.5)`*

---

## Data Flow

```
Main Menu → Play → MapSelector
    → User selects "Map 1"
    → startNewRun('map_1')
    → getMapById('map_1') loads layout
    → Store sets gridSize, startPoint, endPoint, path
    → GameScene renders with map layout
```

---

## Adding a New Map

1. Add entry to `MAP_DEFINITIONS` in `src/data/maps_database.ts`:
   - `id`: unique string (e.g. `map_2`)
   - `name`: display name
   - `order`: display order in selector
   - `gridSize`, `startPoint`, `endPoint`
   - `description`: optional
   - `enemyCountMultiplier`: optional; default 1. Use 2 for double enemies per wave.
  - `obstacles`: optional `Point[]` — static unbuildable tiles that block path.
  - `builtBy`: optional string — shown in MapSelector as "Built by X".
2. Ensure `findPath(gridSize, startPoint, endPoint, obstacles ?? [])` returns a valid path (start and end must be reachable).
3. Document wave layout in this doc (see Map 1 example).
