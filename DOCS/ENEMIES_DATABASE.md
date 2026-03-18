# Enemies Database

> **Source:** `src/data/enemies_database.ts`  
> **Last Updated:** March 10, 2026

Central reference for enemy types, wave composition, and spawn logic. All tuning lives in the database module; the game store and spawn systems consume it.

---

## Quick Reference (Base Formula)

| Wave | Base Count | Spawn Interval |
|------|------------|----------------|
| 1    | 6          | 2000 ms        |
| 2    | 8          | 2000 ms        |
| 3    | 9          | 2000 ms        |
| 5    | 12         | 2000 ms        |
| 10   | 20         | 2000 ms        |

*Base formula: `floor(5 + wave * 1.5)`*  
*Per-map: `count = floor(base * map.enemyCountMultiplier)` — see [Maps Database](MAPS_DATABASE.md) for map-specific wave info.*

---

## Enemy Types

| Type     | minWave | spawnWeight | HP Mult | Speed Mult | Armor | Gold | Notes                    |
|----------|---------|-------------|---------|-------------|-------|------|---------------------------|
| Standard | 1       | 2           | 1.0     | 1.0         | —     | 5    | Default, path-following   |
| Runner   | 2       | 1.2         | 0.4     | 2.0         | —     | 5    | Fast, fragile, lime       |
| Swarm    | 2       | 1           | 0.25    | 2.5         | —     | 3    | Very fast, very low HP, gold |
| Flying   | 3       | 0.6         | 0.5     | 1.5         | —     | 5    | Ignores path, beelines    |
| Brute    | 3       | 0.8         | 2.5     | 0.6         | —     | 8   | High HP, slow, indigo     |
| Tank     | 4       | 1.4         | 3.0     | 0.5         | 0.5   | 5    | Armored, slow, dark red   |

**Spawn logic:** Weighted random. Only types with `minWave <= currentWave` are eligible. Higher `spawnWeight` = more likely when rolled.

---

## Stat Formulas

### HP
```
baseHp = WAVE_CONFIG.baseHp + wave * WAVE_CONFIG.hpPerWave   // 10 + wave*2
hp = floor(baseHp * ENEMY_DEFINITIONS[type].hpMultiplier)
```

### Speed
```
baseSpeed = WAVE_CONFIG.baseSpeed + random(0, speedVariance) + wave * WAVE_CONFIG.speedPerWave
speed = baseSpeed * ENEMY_DEFINITIONS[type].speedMultiplier
```

### Armor
- Only Tank has armor (0.5 = 50% damage reduction).
- Applied in `damageEnemy` and `damageEnemiesInRadius`.

---

## Wave Config (`WAVE_CONFIG`)

| Field           | Value | Purpose                              |
|-----------------|-------|--------------------------------------|
| baseCount       | 5     | Base enemies for wave 1              |
| countPerWave    | 1.5   | Extra enemies per wave               |
| spawnIntervalMs | 2000  | Ms between spawns                    |
| baseHp          | 10    | Base HP before type multiplier       |
| hpPerWave       | 2     | HP added per wave                    |
| baseSpeed       | 1.5   | Base speed                           |
| speedVariance   | 0.5   | Random 0–0.5 added to base speed     |
| speedPerWave    | 0.1   | Speed added per wave                 |

---

## Exported Functions

| Function                    | Returns | Use |
|----------------------------|---------|-----|
| `getEnemyCountForWave(wave)` | number | Enemy count for wave |
| `getSpawnIntervalForWave(wave)` | number | Spawn interval in ms |
| `rollEnemyTypeForWave(wave)` | EnemyType | Which type to spawn |
| `computeEnemyStats(type, wave)` | { hp, speed, armor?, goldReward } | Stats for a new spawn |

---

## Data Flow

```
WaveManagerUI / START WAVE 1
    → startNextWave()
    → enemiesToSpawnThisWave = getEnemyCountForWave(nextWave)

EnemyManager (setInterval)
    → spawnEnemy() every getSpawnIntervalForWave(wave) ms
    → type = rollEnemyTypeForWave(wave)
    → { hp, speed, armor, goldReward } = computeEnemyStats(type, wave)
    → Add enemy to store with goldReward

Enemy death (damageEnemy / damageEnemiesInRadius)
    → gold += enemy.goldReward
```

---

## Adding a New Enemy Type

1. Add type to `EnemyType` in `gameStore.ts`.
2. Add definition to `ENEMY_DEFINITIONS` in `enemies_database.ts`.
3. Add visual handling in `Enemy.tsx` (color, geometry, scale).
4. Add `deathParticleColor` case in `gameStore.ts` if desired.
