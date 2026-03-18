/**
 * Environment — single source of truth for scene atmosphere, materials, and timing.
 * [TRACE: ENVIRONMENT_DESIGN.md]
 */

// ─── Palette (hex) ─────────────────────────────────────────────────────────
export const ENV_PALETTE = {
  /** Canvas/sky background; match fog for seamless edge */
  background: '#0d0d12',
  /** Body text, UI base */
  text: '#e0e0e0',
  /** Primary accent: path, buttons, valid hologram */
  accent: '#00d2d3',
  /** Invalid placement, danger */
  danger: '#ff7675',
  /** Start pylon base */
  startBase: '#341f97',
  /** Start pylon glow */
  startGlow: '#54a0ff',
  /** End pylon base */
  endBase: '#b33939',
  /** End pylon glow */
  endGlow: '#ff5252',
  /** Ground plane */
  ground: '#2d3436',
  /** Grid lines primary */
  gridPrimary: '#1e272e',
  /** Grid lines secondary */
  gridSecondary: '#485460',
  /** Obstacles / ruins */
  obstacle: '#4a4a4a',
  /** Path preview tint */
  pathPreview: '#00d2d3',
} as const;

// ─── Lighting ──────────────────────────────────────────────────────────────
export const ENV_LIGHTING = {
  ambient: {
    intensity: 0.4,
  },
  directional: {
    position: [10, 20, 10] as [number, number, number],
    intensity: 1.2,
    shadowMapSize: 2048 as const,
  },
  /** Start pylon point light */
  startPylon: {
    color: ENV_PALETTE.startGlow,
    intensity: 0.5,
    distance: 3,
  },
  /** End pylon point light */
  endPylon: {
    color: ENV_PALETTE.endGlow,
    intensity: 0.5,
    distance: 3,
  },
} as const;

// ─── Fog ───────────────────────────────────────────────────────────────────
export const ENV_FOG = {
  color: ENV_PALETTE.background,
  near: 15,
  far: 30,
} as const;

// ─── Post-processing ───────────────────────────────────────────────────────
export const ENV_POST = {
  bloom: {
    luminanceThreshold: 0.5,
    mipmapBlur: true,
    intensity: 1.5,
    radius: 0.4,
  },
  vignette: {
    eskil: false,
    offset: 0.1,
    darkness: 0.8,
  },
} as const;

// ─── Ground & Grid ─────────────────────────────────────────────────────────
export const ENV_GROUND = {
  plane: {
    color: ENV_PALETTE.ground,
    roughness: 0.8,
    metalness: 0.2,
    positionY: -0.1,
  },
  gridHelper: {
    primaryColor: ENV_PALETTE.gridPrimary,
    secondaryColor: ENV_PALETTE.gridSecondary,
    positionY: -0.09,
  },
} as const;

// ─── Obstacles ────────────────────────────────────────────────────────────
export const ENV_OBSTACLES = {
  box: {
    size: [0.85, 0.4, 0.85] as [number, number, number],
    positionY: 0.15,
    material: {
      color: ENV_PALETTE.obstacle,
      roughness: 0.9,
      metalness: 0.1,
    },
  },
} as const;

// ─── Pylons (start/end) ────────────────────────────────────────────────────
export const ENV_PYLONS = {
  base: {
    radiusTop: 0.4,
    radiusBottom: 0.5,
    height: 0.1,
    segments: 32,
  },
  spire: {
    radius: 0.1,
    height: 0.6,
    segments: 32,
  },
  start: {
    baseColor: ENV_PALETTE.startBase,
    baseMetalness: 0.8,
    baseRoughness: 0.2,
    spireColor: ENV_PALETTE.startGlow,
    spireEmissive: ENV_PALETTE.startGlow,
    spireEmissiveIntensity: 2,
  },
  end: {
    baseColor: ENV_PALETTE.endBase,
    baseMetalness: 0.8,
    baseRoughness: 0.2,
    spireColor: ENV_PALETTE.endGlow,
    spireEmissive: ENV_PALETTE.endGlow,
    spireEmissiveIntensity: 2,
  },
} as const;

// ─── Placement Hologram ────────────────────────────────────────────────────
export const ENV_HOLOGRAM = {
  validColor: ENV_PALETTE.accent,
  invalidColor: ENV_PALETTE.danger,
  opacity: 0.3,
  baseSize: [0.9, 0.4, 0.9] as [number, number, number],
} as const;

// ─── Path Preview ───────────────────────────────────────────────────────────
export const ENV_PATH_PREVIEW = {
  boxSize: [0.4, 0.02, 0.4] as [number, number, number],
  positionY: -0.08,
  color: ENV_PALETTE.pathPreview,
  emissiveIntensity: 0.5,
  opacity: 0.2,
} as const;

// ─── VFX Timing (seconds) ───────────────────────────────────────────────────
export const ENV_VFX = {
  particleLifetime: 0.5,
  floatingTextLifetime: 1.0,
  floatingTextRiseSpeed: 1.5,
  hitFlashDuration: 0.15,
} as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Linear interpolate between two hex colors; t in [0,1] */
export function lerpColorHex(hexA: string, hexB: string, t: number): string {
  const parse = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  };
  const a = parse(hexA);
  const b = parse(hexB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `#${(1 << 24 | r << 16 | g << 8 | bl).toString(16).slice(1)}`;
}

/** Fog args for Three.js Fog constructor [color, near, far] */
export function getFogArgs(): [string, number, number] {
  return [ENV_FOG.color, ENV_FOG.near, ENV_FOG.far];
}
