/**
 * Themes Database — central source for visual themes (palette, lighting, fog, UI, unit colors).
 * [TRACE: ENVIRONMENT_DESIGN.md]
 */

import type { EnemyType } from '../store/gameStore';

export type ThemeId = 'egyptian' | 'historical' | 'mythic';

export type DecorStyle = 'obelisk' | 'ruin' | 'shrine';

export type ThemePalette = {
  background: string;
  text: string;
  accent: string;
  danger: string;
  startBase: string;
  startGlow: string;
  endBase: string;
  endGlow: string;
  ground: string;
  gridPrimary: string;
  gridSecondary: string;
  obstacle: string;
  pathPreview: string;
};

export type ThemeLighting = {
  ambient: { intensity: number };
  directional: {
    position: [number, number, number];
    intensity: number;
    shadowMapSize: 2048;
  };
  startPylon: { color: string; intensity: number; distance: number };
  endPylon: { color: string; intensity: number; distance: number };
};

export type ThemeFog = {
  color: string;
  near: number;
  far: number;
};

export type ThemePost = {
  bloom: {
    luminanceThreshold: number;
    mipmapBlur: boolean;
    intensity: number;
    radius: number;
  };
  vignette: {
    eskil: boolean;
    offset: number;
    darkness: number;
  };
};

export type ThemeUI = {
  menuBg: string;
  menuAccent: string;
  buttonBg: string;
  buttonHover: string;
};

export type ThemeUnitColors = {
  enemy: Partial<Record<EnemyType, string>>;
  tower: {
    gatling: string;
    mortar: string;
    tracerDefault: string;
    tracerRapid: string;
    tracerPierce: string;
    tracerBigBoom: string;
    tracerShrapnel: string;
  };
};

export type ThemeDecor = {
  style: DecorStyle;
  obstacleColor: string;
  obstacleRoughness: number;
  obstacleMetalness: number;
  /** Shrine style: subtle glow */
  obstacleEmissive?: string;
  obstacleEmissiveIntensity?: number;
};

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  palette: ThemePalette;
  lighting: ThemeLighting;
  fog: ThemeFog;
  post: ThemePost;
  ui: ThemeUI;
  unitColors: ThemeUnitColors;
  decor: ThemeDecor;
};

const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'historical',
    name: 'Historical',
    palette: {
      background: '#0d0d12',
      text: '#e0e0e0',
      accent: '#00d2d3',
      danger: '#ff7675',
      startBase: '#341f97',
      startGlow: '#54a0ff',
      endBase: '#b33939',
      endGlow: '#ff5252',
      ground: '#2d3436',
      gridPrimary: '#1e272e',
      gridSecondary: '#485460',
      obstacle: '#4a4a4a',
      pathPreview: '#00d2d3',
    },
    lighting: {
      ambient: { intensity: 0.4 },
      directional: {
        position: [10, 20, 10],
        intensity: 1.2,
        shadowMapSize: 2048,
      },
      startPylon: { color: '#54a0ff', intensity: 0.5, distance: 3 },
      endPylon: { color: '#ff5252', intensity: 0.5, distance: 3 },
    },
    fog: { color: '#0d0d12', near: 15, far: 30 },
    post: {
      bloom: {
        luminanceThreshold: 0.5,
        mipmapBlur: true,
        intensity: 1.5,
        radius: 0.4,
      },
      vignette: { eskil: false, offset: 0.1, darkness: 0.8 },
    },
    ui: {
      menuBg: '#0d0d12',
      menuAccent: '#00d2d3',
      buttonBg: '#ffb347',
      buttonHover: '#ffc966',
    },
    unitColors: {
      enemy: {
        Standard: '#ff4500',
        Tank: '#8b0000',
        Flying: '#00bfff',
        Runner: '#32cd32',
        Swarm: '#ffd700',
        Brute: '#4b0082',
      },
      tower: {
        gatling: '#ff1493',
        mortar: '#ff4500',
        tracerDefault: '#ffff00',
        tracerRapid: '#ffff88',
        tracerPierce: '#88ddff',
        tracerBigBoom: '#ff4400',
        tracerShrapnel: '#ffaa00',
      },
    },
    decor: {
      style: 'ruin',
      obstacleColor: '#4a4a4a',
      obstacleRoughness: 0.9,
      obstacleMetalness: 0.1,
    },
  },
  {
    id: 'egyptian',
    name: 'Egyptian',
    palette: {
      background: '#1a1a0e',
      text: '#e8dcc4',
      accent: '#d4a84b',
      danger: '#c94a2a',
      startBase: '#5c4033',
      startGlow: '#e8b86d',
      endBase: '#8b4513',
      endGlow: '#ff8c42',
      ground: '#3d3d2a',
      gridPrimary: '#2a2a1a',
      gridSecondary: '#5a5a3a',
      obstacle: '#6b5b4a',
      pathPreview: '#d4a84b',
    },
    lighting: {
      ambient: { intensity: 0.5 },
      directional: {
        position: [15, 25, 0],
        intensity: 1.4,
        shadowMapSize: 2048,
      },
      startPylon: { color: '#e8b86d', intensity: 0.6, distance: 3 },
      endPylon: { color: '#ff8c42', intensity: 0.6, distance: 3 },
    },
    fog: { color: '#1a1a0e', near: 18, far: 35 },
    post: {
      bloom: {
        luminanceThreshold: 0.45,
        mipmapBlur: true,
        intensity: 1.6,
        radius: 0.4,
      },
      vignette: { eskil: false, offset: 0.12, darkness: 0.75 },
    },
    ui: {
      menuBg: '#1a1a0e',
      menuAccent: '#d4a84b',
      buttonBg: '#c9a227',
      buttonHover: '#e8d068',
    },
    unitColors: {
      enemy: {
        Standard: '#c94a2a',
        Tank: '#5c4033',
        Flying: '#7eb8da',
        Runner: '#8fbc8f',
        Swarm: '#daa520',
        Brute: '#4b0082',
      },
      tower: {
        gatling: '#cd853f',
        mortar: '#ff8c42',
        tracerDefault: '#ffd700',
        tracerRapid: '#ffff88',
        tracerPierce: '#87ceeb',
        tracerBigBoom: '#ff6347',
        tracerShrapnel: '#ffa500',
      },
    },
    decor: {
      style: 'obelisk',
      obstacleColor: '#6b5b4a',
      obstacleRoughness: 0.85,
      obstacleMetalness: 0.15,
    },
  },
  {
    id: 'mythic',
    name: 'Mythic',
    palette: {
      background: '#0f0a1a',
      text: '#e0d8f0',
      accent: '#9b59b6',
      danger: '#e74c3c',
      startBase: '#2c3e50',
      startGlow: '#8e44ad',
      endBase: '#6c3483',
      endGlow: '#bb8fce',
      ground: '#1a1a2e',
      gridPrimary: '#1e1e2e',
      gridSecondary: '#4a4a6a',
      obstacle: '#3d3d5c',
      pathPreview: '#9b59b6',
    },
    lighting: {
      ambient: { intensity: 0.35 },
      directional: {
        position: [5, 15, 0],
        intensity: 1.0,
        shadowMapSize: 2048,
      },
      startPylon: { color: '#8e44ad', intensity: 0.7, distance: 4 },
      endPylon: { color: '#bb8fce', intensity: 0.7, distance: 4 },
    },
    fog: { color: '#0f0a1a', near: 12, far: 28 },
    post: {
      bloom: {
        luminanceThreshold: 0.4,
        mipmapBlur: true,
        intensity: 1.8,
        radius: 0.45,
      },
      vignette: { eskil: false, offset: 0.15, darkness: 0.85 },
    },
    ui: {
      menuBg: '#0f0a1a',
      menuAccent: '#9b59b6',
      buttonBg: '#6c3483',
      buttonHover: '#8e44ad',
    },
    unitColors: {
      enemy: {
        Standard: '#e74c3c',
        Tank: '#8b0000',
        Flying: '#3498db',
        Runner: '#2ecc71',
        Swarm: '#f1c40f',
        Brute: '#9b59b6',
      },
      tower: {
        gatling: '#9b59b6',
        mortar: '#e74c3c',
        tracerDefault: '#bb8fce',
        tracerRapid: '#d7bde2',
        tracerPierce: '#85c1e9',
        tracerBigBoom: '#e74c3c',
        tracerShrapnel: '#f39c12',
      },
    },
    decor: {
      style: 'shrine',
      obstacleColor: '#3d3d5c',
      obstacleRoughness: 0.7,
      obstacleMetalness: 0.25,
      obstacleEmissive: '#9b59b6',
      obstacleEmissiveIntensity: 0.3,
    },
  },
];

/** Get theme by id; returns historical if not found */
export function getThemeById(id: ThemeId): ThemeDefinition {
  const theme = THEME_DEFINITIONS.find((t) => t.id === id);
  return theme ?? THEME_DEFINITIONS[0];
}

/** Get all themes sorted by id */
export function getAllThemes(): ThemeDefinition[] {
  return [...THEME_DEFINITIONS];
}
