/**
 * Maps Database — central source for map layouts (grid, start, end).
 */

import type { Point } from '../types/game';
import type { ThemeId } from './themes_database';

export type MapDefinition = {
  id: string;
  name: string;
  /** Display order in selector */
  order: number;
  gridSize: number;
  startPoint: Point;
  endPoint: Point;
  /** Optional description for UI */
  description?: string;
  /** Multiplier for enemy count per wave (default 1). Map 1 uses 2 = double enemies. */
  enemyCountMultiplier?: number;
  /** Static obstacles (unbuildable, block path). Path must remain valid. */
  obstacles?: Point[];
  /** Shown in MapSelector as "Built by X" */
  builtBy?: string;
  /** Default theme for this map when selectedTheme is 'map_default' */
  defaultThemeId?: ThemeId;
};

/** Map definitions — add new maps here */
export const MAP_DEFINITIONS: MapDefinition[] = [
  {
    id: 'map_1',
    name: 'The First Line',
    order: 1,
    gridSize: 10,
    startPoint: { x: 0, z: 0 },
    endPoint: { x: 9, z: 9 },
    description: 'Classic corner-to-corner. Your first stand.',
    enemyCountMultiplier: 2,
    defaultThemeId: 'historical',
  },
  {
    id: 'map_2',
    name: 'The Gauntlet',
    order: 2,
    gridSize: 14,
    startPoint: { x: 0, z: 0 },
    endPoint: { x: 13, z: 13 },
    description: 'Larger battlefield with obstacles. Path winds through the ruins.',
    enemyCountMultiplier: 1.5,
    builtBy: 'You',
    defaultThemeId: 'egyptian',
    obstacles: [
      { x: 6, z: 4 }, { x: 6, z: 5 }, { x: 6, z: 6 }, { x: 6, z: 7 }, { x: 6, z: 8 }, { x: 6, z: 9 },
      { x: 8, z: 8 }, { x: 9, z: 8 }, { x: 10, z: 8 }, { x: 11, z: 8 }, { x: 12, z: 8 },
      { x: 3, z: 6 }, { x: 4, z: 6 }, { x: 5, z: 6 },
    ],
  },
];

/** Get map by id; returns first map if not found */
export function getMapById(id: string): MapDefinition {
  const map = MAP_DEFINITIONS.find((m) => m.id === id);
  return map ?? MAP_DEFINITIONS[0];
}

/** Get all maps sorted by order */
export function getAllMaps(): MapDefinition[] {
  return [...MAP_DEFINITIONS].sort((a, b) => a.order - b.order);
}
