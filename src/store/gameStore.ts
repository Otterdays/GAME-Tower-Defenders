import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Vector3 } from 'three';
import { findPath } from '../utils/pathfinding';
import type { Point } from '../types/game';
import {
  getEnemyCountForWave,
  rollEnemyTypeForWave,
  computeEnemyStats,
} from '../data/enemies_database';
import { getMapById } from '../data/maps_database';
import { getThemeById, type ThemeId } from '../data/themes_database';

export type { Point };
export type { ThemeId };

/** Resolve active theme: map default or global override */
export function getActiveThemeId(settings: SettingsData, currentMapId: string): ThemeId {
  const sel = settings.selectedThemeId;
  if (sel === 'map_default') {
    const map = getMapById(currentMapId);
    return (map.defaultThemeId ?? 'historical') as ThemeId;
  }
  return sel;
}
export { getEnemyCountForWave, getSpawnIntervalForWave } from '../data/enemies_database';

function deathParticleColor(themeId: ThemeId, type: EnemyType): string {
  const theme = getThemeById(themeId);
  return theme.unitColors.enemy[type] ?? '#ff4500';
}

export type EnemyType = 'Standard' | 'Tank' | 'Flying' | 'Runner' | 'Swarm' | 'Brute';

export type EnemyData = {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  /** Damage reduction 0–1; e.g. Tank uses 0.5 for 50% less direct damage. */
  armor?: number;
  /** Gold awarded on kill (from enemies_database). */
  goldReward: number;
};

export type TargetMode = 'nearest' | 'closestToGoal' | 'highestHp' | 'lowestHp' | 'fastest';

export type GatlingUpgrade = 'default' | 'rapid' | 'pierce';
export type MortarUpgrade = 'default' | 'bigBoom' | 'shrapnel';

export type TowerUpgrade = GatlingUpgrade | MortarUpgrade;

export type FloatingTextData = {
  id: string;
  text: string;
  position: [number, number, number];
  color: string;
  timestamp: number;
};

export type ParticleData = {
  id: string;
  position: [number, number, number];
  color: string;
  timestamp: number;
};

export type TowerType = 'Gatling' | 'Mortar';

export type TowerData = {
  id: string;
  x: number;
  z: number;
  type: TowerType;
  /** Optional upgrade; defaults to 'default' when omitted. */
  upgrade?: TowerUpgrade;
};

// Mutable object to track positions without triggering re-renders
export const enemyPositions: Record<string, Vector3> = {};

const SETTINGS_STORAGE_KEY = 'ironhold-settings';

export type RunState = 'IDLE' | 'PRE_WAVE' | 'WAVE' | 'PAUSED' | 'GAME_OVER';
export type ActiveOverlay = 'NONE' | 'PAUSE' | 'SETTINGS' | 'GAME_OVER' | 'GALLERY';

export type SelectedThemeId = ThemeId | 'map_default';

export type SettingsData = {
  masterVolume: number;
  isMuted: boolean;
  screenShake: boolean;
  showParticles: boolean;
  showFloatingText: boolean;
  showPathPreview: boolean;
  reducedMotion: boolean;
  /** Theme: 'map_default' uses map's defaultThemeId; else global override */
  selectedThemeId: SelectedThemeId;
};

const DEFAULT_SETTINGS: SettingsData = {
  masterVolume: 0.5,
  isMuted: false,
  screenShake: true,
  showParticles: true,
  showFloatingText: true,
  showPathPreview: true,
  reducedMotion: false,
  selectedThemeId: 'map_default',
};

function loadSettingsFromStorage(): SettingsData {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<SettingsData>;
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    const validThemes: SelectedThemeId[] = ['map_default', 'egyptian', 'historical', 'mythic'];
    if (!validThemes.includes(merged.selectedThemeId as SelectedThemeId)) merged.selectedThemeId = 'map_default';
    return merged;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettingsToStorage(settings: SettingsData) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

interface GameState {
  screen: 'MENU' | 'PLAYING';
  setScreen: (screen: 'MENU' | 'PLAYING') => void;
  runState: RunState;
  activeOverlay: ActiveOverlay;
  settingsSource: 'menu' | 'pause' | null;
  settings: SettingsData;
  narratorMessage: string;
  setNarratorMessage: (message: string) => void;
  gold: number;
  health: number;

  // Wave Management
  wave: number;
  isWaveActive: boolean;
  enemiesSpawnedThisWave: number;
  enemiesToSpawnThisWave: number;
  startNextWave: () => void;
  setWaveActive: (active: boolean) => void;

  lastBaseHit: number;

  // Lifecycle
  startNewRun: (mapId: string) => void;
  restartRun: () => void;
  returnToMenu: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  openSettings: (source: 'menu' | 'pause') => void;
  closeSettings: () => void;
  setMasterVolume: (volume: number) => void;
  setMuted: (isMuted: boolean) => void;
  openGallery: () => void;
  closeGallery: () => void;
  updateVisualSetting: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void;
  setSelectedTheme: (themeId: SelectedThemeId) => void;
  loadSettings: () => void;
  loseHealth: (amount: number) => void;

  currentMapId: string;
  gridSize: number;
  startPoint: Point;
  endPoint: Point;
  obstacles: Point[];
  towers: TowerData[];
  path: Point[];
  selectedTowerType: TowerType;
  setSelectedTowerType: (type: TowerType) => void;
  selectedTargetMode: TargetMode;
  setSelectedTargetMode: (mode: TargetMode) => void;
  selectedGatlingUpgrade: GatlingUpgrade;
  setSelectedGatlingUpgrade: (upgrade: GatlingUpgrade) => void;
  selectedMortarUpgrade: MortarUpgrade;
  setSelectedMortarUpgrade: (upgrade: MortarUpgrade) => void;

  enemies: EnemyData[];

  // VFX
  floatingTexts: FloatingTextData[];
  particles: ParticleData[];

  setPath: (path: Point[]) => void;
  addTower: (tower: Omit<TowerData, 'id'>) => void;
  setHealth: (health: number) => void;
  addGold: (amount: number) => void;
  spawnEnemy: () => void;
  removeEnemy: (id: string) => void;
  damageEnemy: (id: string, amount: number) => void;
  damageEnemiesInRadius: (center: [number, number, number], radius: number, amount: number) => void;

  addFloatingText: (text: string, position: [number, number, number], color?: string) => void;
  removeFloatingText: (id: string) => void;
  addParticle: (position: [number, number, number], color?: string) => void;
  removeParticle: (id: string) => void;
}

function createInitialRunState(
  gridSize: number,
  startPoint: Point,
  endPoint: Point,
  obstacles: Point[]
) {
  const blocked = obstacles;
  const path = findPath(gridSize, startPoint, endPoint, blocked) ?? [];
  return {
    gold: 200,
    health: 20,
    wave: 0,
    isWaveActive: false,
    enemiesSpawnedThisWave: 0,
    enemiesToSpawnThisWave: 5,
    lastBaseHit: 0,
    obstacles,
    towers: [] as TowerData[],
    path,
    enemies: [] as EnemyData[],
    floatingTexts: [] as FloatingTextData[],
    particles: [] as ParticleData[],
    runState: 'PRE_WAVE' as RunState,
    activeOverlay: 'NONE' as ActiveOverlay,
    narratorMessage: "Welcome to the grand tour of the impending doom! I'm your guide! Please place some towers on the grid to direct our lovely guests.",
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'MENU',
  setScreen: (screen) => set({ screen }),
  runState: 'IDLE',
  activeOverlay: 'NONE',
  settingsSource: null,
  currentMapId: 'map_1',
  settings: loadSettingsFromStorage(),
  narratorMessage: "Welcome to the grand tour of the impending doom! I'm your guide! Please place some towers on the grid to direct our lovely guests.",
  setNarratorMessage: (message) => set({ narratorMessage: message }),
  gold: 200,
  health: 20,

  wave: 0,
  isWaveActive: false,
  enemiesSpawnedThisWave: 0,
  enemiesToSpawnThisWave: 5,

  startNextWave: () => set((state) => {
    if (state.runState === 'PAUSED' || state.runState === 'GAME_OVER') return state;
    const nextWave = state.wave + 1;
    const map = getMapById(state.currentMapId ?? 'map_1');
    const mult = map.enemyCountMultiplier ?? 1;
    return {
      wave: nextWave,
      isWaveActive: true,
      runState: 'WAVE',
      enemiesSpawnedThisWave: 0,
      enemiesToSpawnThisWave: getEnemyCountForWave(nextWave, mult),
      narratorMessage: `Here comes Wave ${nextWave}! Brace yourselves!`
    };
  }),
  setWaveActive: (active) => set({ isWaveActive: active }),

  lastBaseHit: 0,

  startNewRun: (mapId) => {
    const map = getMapById(mapId);
    const obstacles = map.obstacles ?? [];
    Object.keys(enemyPositions).forEach(k => delete enemyPositions[k]);
    set({
      ...createInitialRunState(map.gridSize, map.startPoint, map.endPoint, obstacles),
      currentMapId: mapId,
      gridSize: map.gridSize,
      startPoint: map.startPoint,
      endPoint: map.endPoint,
      obstacles,
      towers: [],
      path: findPath(map.gridSize, map.startPoint, map.endPoint, obstacles) ?? [],
      screen: 'PLAYING',
    });
  },
  restartRun: () => {
    const state = get();
    Object.keys(enemyPositions).forEach(k => delete enemyPositions[k]);
    set({
      ...createInitialRunState(
        state.gridSize,
        state.startPoint,
        state.endPoint,
        state.obstacles
      ),
      currentMapId: state.currentMapId ?? 'map_1',
      obstacles: state.obstacles,
      screen: 'PLAYING',
      activeOverlay: 'NONE',
    });
  },
  returnToMenu: () => {
    Object.keys(enemyPositions).forEach(k => delete enemyPositions[k]);
    set({
      screen: 'MENU',
      runState: 'IDLE',
      activeOverlay: 'NONE',
      settingsSource: null,
      currentMapId: 'map_1',
      gold: 200,
      health: 20,
      wave: 0,
      isWaveActive: false,
      enemiesSpawnedThisWave: 0,
      enemiesToSpawnThisWave: 5,
      lastBaseHit: 0,
      obstacles: [],
      towers: [],
      path: [],
      enemies: [],
      floatingTexts: [],
      particles: [],
      narratorMessage: "Welcome back! Ready for another tour?",
    });
  },
  pauseGame: () => set({ runState: 'PAUSED', activeOverlay: 'PAUSE' }),
  resumeGame: () => set({ runState: 'WAVE', activeOverlay: 'NONE' }),
  openGallery: () => set({ activeOverlay: 'GALLERY' }),
  closeGallery: () => set({ activeOverlay: 'NONE' }),
  openSettings: (source) => set({ activeOverlay: 'SETTINGS', settingsSource: source }),
  closeSettings: () => {
    const { settingsSource } = get();
    if (settingsSource === 'pause') {
      set({ activeOverlay: 'PAUSE', settingsSource: null });
    } else {
      set({ activeOverlay: 'NONE', settingsSource: null });
    }
  },
  setMasterVolume: (volume) => set((state) => {
    const next = { ...state.settings, masterVolume: Math.max(0, Math.min(1, volume)) };
    saveSettingsToStorage(next);
    return { settings: next };
  }),
  setMuted: (isMuted) => set((state) => {
    const next = { ...state.settings, isMuted };
    saveSettingsToStorage(next);
    return { settings: next };
  }),
  updateVisualSetting: (key, value) => set((state) => {
    const next = { ...state.settings, [key]: value };
    saveSettingsToStorage(next);
    return { settings: next };
  }),
  setSelectedTheme: (themeId) => set((state) => {
    const next = { ...state.settings, selectedThemeId: themeId };
    saveSettingsToStorage(next);
    return { settings: next };
  }),
  loadSettings: () => set({ settings: loadSettingsFromStorage() }),
  loseHealth: (amount) => set((state) => {
    const newHealth = Math.max(0, state.health - amount);
    if (newHealth <= 0) {
      Object.keys(enemyPositions).forEach(k => delete enemyPositions[k]);
      return {
        health: 0,
        runState: 'GAME_OVER',
        activeOverlay: 'GAME_OVER',
        isWaveActive: false,
        lastBaseHit: Date.now(),
      };
    }
    return {
      health: newHealth,
      lastBaseHit: Date.now(),
    };
  }),

  gridSize: 10,
  startPoint: { x: 0, z: 0 },
  endPoint: { x: 9, z: 9 },
  obstacles: [],
  towers: [],
  path: [],
  selectedTowerType: 'Gatling',
  setSelectedTowerType: (type) => set({ selectedTowerType: type }),
  selectedTargetMode: 'nearest',
  setSelectedTargetMode: (mode) => set({ selectedTargetMode: mode }),
  selectedGatlingUpgrade: 'default',
  setSelectedGatlingUpgrade: (upgrade) => set({ selectedGatlingUpgrade: upgrade }),
  selectedMortarUpgrade: 'default',
  setSelectedMortarUpgrade: (upgrade) => set({ selectedMortarUpgrade: upgrade }),

  enemies: [],
  floatingTexts: [],
  particles: [],

  setPath: (path) => set({ path }),
  addTower: (tower) => set((state) => {
    const upgrade = tower.type === 'Gatling' ? state.selectedGatlingUpgrade : state.selectedMortarUpgrade;
    return { towers: [...state.towers, { ...tower, id: uuidv4(), upgrade: upgrade ?? 'default' }] };
  }),
  setHealth: (health) => set((state) => ({
    health,
    lastBaseHit: health < state.health ? Date.now() : state.lastBaseHit
  })),
  addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

  spawnEnemy: () => set((state) => {
    if (!state.isWaveActive || state.enemiesSpawnedThisWave >= state.enemiesToSpawnThisWave) {
      return state;
    }

    const type = rollEnemyTypeForWave(state.wave);
    const { hp, speed, armor, goldReward } = computeEnemyStats(type, state.wave);

    return {
      enemiesSpawnedThisWave: state.enemiesSpawnedThisWave + 1,
      enemies: [...state.enemies, {
        id: uuidv4(),
        type,
        hp,
        maxHp: hp,
        speed,
        goldReward,
        ...(armor !== undefined && { armor })
      }]
    };
  }),

  removeEnemy: (id) => {
    delete enemyPositions[id];
    set((state) => ({
      enemies: state.enemies.filter(e => e.id !== id)
    }));
  },

  damageEnemy: (id, amount) => set((state) => {
    const enemyIndex = state.enemies.findIndex(e => e.id === id);
    if (enemyIndex === -1) return state;

    const newEnemies = [...state.enemies];
    const enemy = newEnemies[enemyIndex];
    const effectiveAmount = Math.max(1, Math.floor(amount * (1 - (enemy.armor ?? 0))));
    enemy.hp -= effectiveAmount;

    const ePos = enemyPositions[id];
    const posArray: [number, number, number] = ePos ? [ePos.x, ePos.y, ePos.z] : [0,0,0];

    const newFloatingTexts = [...state.floatingTexts, {
      id: uuidv4(),
      text: `-${effectiveAmount}`,
      position: posArray,
      color: '#ff0000',
      timestamp: Date.now()
    }];

    if (enemy.hp <= 0) {
      delete enemyPositions[id];
      newEnemies.splice(enemyIndex, 1);

      const deathMessages = [
        "Ouch! My polygons!",
        "Tell my wife I'm a cube...",
        "I've been deleted!",
        "Blep.",
        "That stings!"
      ];
      const msg = deathMessages[Math.floor(Math.random() * deathMessages.length)];

      newFloatingTexts.push({
        id: uuidv4(),
        text: msg,
        position: [posArray[0], posArray[1] + 0.5, posArray[2]],
        color: '#ffffff',
        timestamp: Date.now()
      });

      const themeId = getActiveThemeId(state.settings, state.currentMapId ?? 'map_1');
      const newParticles = [...state.particles, {
        id: uuidv4(),
        position: posArray,
        color: deathParticleColor(themeId, enemy.type),
        timestamp: Date.now()
      }];

      return {
        enemies: newEnemies,
        gold: state.gold + (enemy.goldReward ?? 5),
        narratorMessage: `Enemy vanquished! They said: "${msg}"`,
        floatingTexts: newFloatingTexts,
        particles: newParticles
      };
    }

    return {
      enemies: newEnemies,
      floatingTexts: newFloatingTexts
    };
  }),

  damageEnemiesInRadius: (center, radius, amount) => set((state) => {
    let stateUpdates: any = {
      enemies: [...state.enemies],
      floatingTexts: [...state.floatingTexts],
      particles: [...state.particles],
      gold: state.gold
    };

    const centerVec = new Vector3(...center);
    const enemiesToDamage = state.enemies.filter(e => {
      const p = enemyPositions[e.id];
      return p && p.distanceTo(centerVec) <= radius;
    });

    let narratorMessage = state.narratorMessage;

    enemiesToDamage.forEach(enemy => {
      const eIndex = stateUpdates.enemies.findIndex((e: any) => e.id === enemy.id);
      if (eIndex === -1) return;

      const ePos = enemyPositions[enemy.id];
      const posArray: [number, number, number] = ePos ? [ePos.x, ePos.y, ePos.z] : [0,0,0];
      const effectiveAmount = Math.max(1, Math.floor(amount * (1 - (enemy.armor ?? 0))));

      stateUpdates.enemies[eIndex].hp -= effectiveAmount;

      stateUpdates.floatingTexts.push({
        id: uuidv4(),
        text: `-${effectiveAmount}`,
        position: posArray,
        color: '#ff0000',
        timestamp: Date.now()
      });

      if (stateUpdates.enemies[eIndex].hp <= 0) {
        delete enemyPositions[enemy.id];
        stateUpdates.enemies.splice(eIndex, 1);

        stateUpdates.floatingTexts.push({
          id: uuidv4(),
          text: "Boom!",
          position: [posArray[0], posArray[1] + 0.5, posArray[2]],
          color: '#ffffff',
          timestamp: Date.now()
        });

        const themeId = getActiveThemeId(state.settings, state.currentMapId ?? 'map_1');
        stateUpdates.particles.push({
          id: uuidv4(),
          position: posArray,
          color: deathParticleColor(themeId, enemy.type),
          timestamp: Date.now()
        });

        stateUpdates.gold += enemy.goldReward ?? 5;
        narratorMessage = "A spectacular explosion!";
      }
    });

    return { ...stateUpdates, narratorMessage };
  }),

  addFloatingText: (text, position, color = '#ffffff') => set(state => ({
    floatingTexts: [...state.floatingTexts, { id: uuidv4(), text, position, color, timestamp: Date.now() }]
  })),
  removeFloatingText: (id) => set(state => ({
    floatingTexts: state.floatingTexts.filter(ft => ft.id !== id)
  })),

  addParticle: (position, color = '#ff4500') => set(state => ({
    particles: [...state.particles, { id: uuidv4(), position, color, timestamp: Date.now() }]
  })),
  removeParticle: (id) => set(state => ({
    particles: state.particles.filter(p => p.id !== id)
  })),

}));
