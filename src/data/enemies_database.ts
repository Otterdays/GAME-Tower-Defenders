/**
 * Enemies Database — central source for enemy types, wave composition, and spawn logic.
 */

import type { EnemyType } from '../store/gameStore';

export type EnemyDefinition = {
  type: EnemyType;
  /** Display name for UI/debug */
  name: string;
  /** Base HP before wave scaling */
  baseHp: number;
  /** HP scaling per wave: finalHp = (baseHp + wave * hpPerWave) * hpMultiplier */
  hpPerWave: number;
  /** Multiplier applied to base HP */
  hpMultiplier: number;
  /** Base speed before wave scaling */
  baseSpeed: number;
  /** Speed variance (added random 0..speedVariance) */
  speedVariance: number;
  /** Speed scaling per wave */
  speedPerWave: number;
  /** Multiplier applied to final speed */
  speedMultiplier: number;
  /** Damage reduction 0–1 (e.g. 0.5 = 50% less damage) */
  armor?: number;
  /** Gold reward on kill */
  goldReward: number;
  /** Minimum wave to spawn (inclusive) */
  minWave: number;
  /** Spawn chance 0–1 when conditions met; higher = more likely when rolled */
  spawnWeight: number;
};

export type WaveConfig = {
  /** Base enemy count for wave 1 */
  baseCount: number;
  /** Additional enemies per wave: count = baseCount + floor(wave * countPerWave) */
  countPerWave: number;
  /** Spawn interval in ms between enemies */
  spawnIntervalMs: number;
  /** Base HP formula: baseHp + wave * hpPerWave (before type multiplier) */
  baseHp: number;
  hpPerWave: number;
  /** Base speed formula */
  baseSpeed: number;
  speedVariance: number;
  speedPerWave: number;
};

/** Enemy type definitions — tune stats and spawn conditions here */
export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyDefinition> = {
  Standard: {
    type: 'Standard',
    name: 'Standard',
    baseHp: 10,
    hpPerWave: 2,
    hpMultiplier: 1,
    baseSpeed: 1.5,
    speedVariance: 0.5,
    speedPerWave: 0.1,
    speedMultiplier: 1,
    goldReward: 5,
    minWave: 1,
    spawnWeight: 2,
  },
  Runner: {
    type: 'Runner',
    name: 'Runner',
    baseHp: 10,
    hpPerWave: 2,
    hpMultiplier: 0.4,
    baseSpeed: 1.5,
    speedVariance: 0.5,
    speedPerWave: 0.1,
    speedMultiplier: 2,
    goldReward: 5,
    minWave: 2,
    spawnWeight: 1.2,
  },
  Flying: {
    type: 'Flying',
    name: 'Flying',
    baseHp: 10,
    hpPerWave: 2,
    hpMultiplier: 0.5,
    baseSpeed: 1.5,
    speedVariance: 0.5,
    speedPerWave: 0.1,
    speedMultiplier: 1.5,
    goldReward: 5,
    minWave: 3,
    spawnWeight: 0.6,
  },
  Tank: {
    type: 'Tank',
    name: 'Tank',
    baseHp: 10,
    hpPerWave: 2,
    hpMultiplier: 3,
    baseSpeed: 1.5,
    speedVariance: 0.5,
    speedPerWave: 0.1,
    speedMultiplier: 0.5,
    armor: 0.5,
    goldReward: 5,
    minWave: 4,
    spawnWeight: 1.4,
  },
  Swarm: {
    type: 'Swarm',
    name: 'Swarm',
    baseHp: 10,
    hpPerWave: 2,
    hpMultiplier: 0.25,
    baseSpeed: 1.5,
    speedVariance: 0.5,
    speedPerWave: 0.1,
    speedMultiplier: 2.5,
    goldReward: 3,
    minWave: 2,
    spawnWeight: 1,
  },
  Brute: {
    type: 'Brute',
    name: 'Brute',
    baseHp: 10,
    hpPerWave: 2,
    hpMultiplier: 2.5,
    baseSpeed: 1.5,
    speedVariance: 0.5,
    speedPerWave: 0.1,
    speedMultiplier: 0.6,
    goldReward: 8,
    minWave: 3,
    spawnWeight: 0.8,
  },
};

/** Wave composition — tune difficulty scaling here */
export const WAVE_CONFIG: WaveConfig = {
  baseCount: 5,
  countPerWave: 1.5,
  spawnIntervalMs: 2000,
  baseHp: 10,
  hpPerWave: 2,
  baseSpeed: 1.5,
  speedVariance: 0.5,
  speedPerWave: 0.1,
};

/**
 * Get enemy count for a given wave.
 * @param wave Wave number (1-based)
 * @param multiplier Optional map multiplier (e.g. 2 for map_1 = double enemies)
 */
export function getEnemyCountForWave(wave: number, multiplier = 1): number {
  const base = Math.floor(WAVE_CONFIG.baseCount + wave * WAVE_CONFIG.countPerWave);
  return Math.max(1, Math.floor(base * multiplier));
}

/**
 * Get spawn interval in ms for a given wave (can scale with wave if desired).
 */
export function getSpawnIntervalForWave(_wave: number): number {
  return WAVE_CONFIG.spawnIntervalMs;
}

/**
 * Roll which enemy type to spawn for a given wave.
 * Uses weighted random: types with minWave <= wave and spawnWeight > 0 are eligible.
 */
export function rollEnemyTypeForWave(wave: number): EnemyType {
  const eligible: { type: EnemyType; weight: number }[] = [];
  for (const def of Object.values(ENEMY_DEFINITIONS)) {
    if (wave >= def.minWave && def.spawnWeight > 0) {
      eligible.push({ type: def.type, weight: def.spawnWeight });
    }
  }
  if (eligible.length === 0) return 'Standard';

  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * totalWeight;
  for (const { type, weight } of eligible) {
    r -= weight;
    if (r <= 0) return type;
  }
  return eligible[eligible.length - 1].type;
}

/**
 * Compute HP and speed for a spawned enemy of given type at given wave.
 */
export function computeEnemyStats(
  type: EnemyType,
  wave: number
): { hp: number; speed: number; armor?: number; goldReward: number } {
  const def = ENEMY_DEFINITIONS[type];
  const baseHp = WAVE_CONFIG.baseHp + wave * WAVE_CONFIG.hpPerWave;
  const hp = Math.floor(baseHp * def.hpMultiplier);
  const baseSpeed =
    WAVE_CONFIG.baseSpeed +
    Math.random() * WAVE_CONFIG.speedVariance +
    wave * WAVE_CONFIG.speedPerWave;
  const speed = baseSpeed * def.speedMultiplier;
  return {
    hp,
    speed,
    armor: def.armor,
    goldReward: def.goldReward,
  };
}
