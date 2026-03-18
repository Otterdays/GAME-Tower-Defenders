/**
 * Theme Runtime — builds env-like values from ThemeDefinition for scene consumers.
 * [TRACE: ENVIRONMENT_DESIGN.md]
 */

import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getActiveThemeId } from '../store/gameStore';
import { getThemeById } from '../data/themes_database';
import type { ThemeDefinition } from '../data/themes_database';

export type ThemeRuntime = {
  palette: {
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
  lighting: {
    ambient: { intensity: number };
    directional: {
      position: [number, number, number];
      intensity: number;
      shadowMapSize: 2048;
    };
    startPylon: { color: string; intensity: number; distance: number };
    endPylon: { color: string; intensity: number; distance: number };
  };
  fog: { color: string; near: number; far: number };
  post: {
    bloom: {
      luminanceThreshold: number;
      mipmapBlur: boolean;
      intensity: number;
      radius: number;
    };
    vignette: { eskil: boolean; offset: number; darkness: number };
  };
  hologram: { validColor: string; invalidColor: string; opacity: number };
  pathPreview: { color: string; emissiveIntensity: number; opacity: number };
  decor: ThemeDefinition['decor'];
  unitColors: ThemeDefinition['unitColors'];
};

export function buildThemeRuntime(theme: ThemeDefinition): ThemeRuntime {
  return {
    palette: { ...theme.palette },
    lighting: {
      ambient: { ...theme.lighting.ambient },
      directional: {
        position: [...theme.lighting.directional.position],
        intensity: theme.lighting.directional.intensity,
        shadowMapSize: 2048,
      },
      startPylon: {
        color: theme.lighting.startPylon.color,
        intensity: theme.lighting.startPylon.intensity,
        distance: theme.lighting.startPylon.distance,
      },
      endPylon: {
        color: theme.lighting.endPylon.color,
        intensity: theme.lighting.endPylon.intensity,
        distance: theme.lighting.endPylon.distance,
      },
    },
    fog: { ...theme.fog },
    post: {
      bloom: { ...theme.post.bloom },
      vignette: { ...theme.post.vignette },
    },
    hologram: {
      validColor: theme.palette.accent,
      invalidColor: theme.palette.danger,
      opacity: 0.3,
    },
    pathPreview: {
      color: theme.palette.pathPreview,
      emissiveIntensity: 0.5,
      opacity: 0.2,
    },
    decor: { ...theme.decor },
    unitColors: theme.unitColors,
  };
}

/** Fog args for Three.js Fog constructor [color, near, far] */
export function getFogArgsFromRuntime(runtime: ThemeRuntime): [string, number, number] {
  return [runtime.fog.color, runtime.fog.near, runtime.fog.far];
}

/** Hook: returns current theme runtime from store */
export function useThemeRuntime(): ThemeRuntime {
  const selectedThemeId = useGameStore((s) => s.settings.selectedThemeId);
  const currentMapId = useGameStore((s) => s.currentMapId);
  return useMemo(() => {
    const settings = useGameStore.getState().settings;
    const themeId = getActiveThemeId(settings, currentMapId ?? 'map_1');
    return buildThemeRuntime(getThemeById(themeId));
  }, [selectedThemeId, currentMapId]);
}
