import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getSpawnIntervalForWave } from '../store/gameStore';
import { Enemy } from './Enemy';

export const EnemyManager: React.FC = () => {
  const { enemies, spawnEnemy, path, runState, wave } = useGameStore();

  useEffect(() => {
    if (path.length === 0 || runState === 'PAUSED' || runState === 'GAME_OVER') return;

    const intervalMs = getSpawnIntervalForWave(wave);
    const spawnInterval = setInterval(spawnEnemy, intervalMs);

    return () => clearInterval(spawnInterval);
  }, [spawnEnemy, path, runState, wave]);

  return (
    <group>
      {enemies.map(enemy => (
        <Enemy key={enemy.id} data={enemy} />
      ))}
    </group>
  );
};
