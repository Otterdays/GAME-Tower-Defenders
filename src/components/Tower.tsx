import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { Line } from '@react-three/drei';
import { useGameStore, enemyPositions } from '../store/gameStore';
import type { TowerData, EnemyData, TargetMode } from '../store/gameStore';
import { audioManager } from '../utils/audio/audioManager';
import { useThemeRuntime } from '../constants/themeRuntime';

const MORTAR_LEAD_TIME = 0.5;

interface TowerProps {
  data: TowerData;
  worldPosition: [number, number, number];
}

function pickTarget(
  inRange: { enemy: EnemyData; pos: Vector3; dist: number; distToGoal: number }[],
  mode: TargetMode
): { enemy: EnemyData; pos: Vector3 } | null {
  if (inRange.length === 0) return null;
  switch (mode) {
    case 'nearest':
      return inRange.reduce((best, cur) => (cur.dist < best.dist ? cur : best));
    case 'closestToGoal':
      return inRange.reduce((best, cur) => (cur.distToGoal < best.distToGoal ? cur : best));
    case 'highestHp':
      return inRange.reduce((best, cur) => (cur.enemy.hp > best.enemy.hp ? cur : best));
    case 'lowestHp':
      return inRange.reduce((best, cur) => (cur.enemy.hp < best.enemy.hp ? cur : best));
    case 'fastest':
      return inRange.reduce((best, cur) => (cur.enemy.speed > best.enemy.speed ? cur : best));
    default:
      return inRange[0];
  }
}

export const Tower: React.FC<TowerProps> = ({ data, worldPosition }) => {
  if (!data) return null;
  const theme = useThemeRuntime();
  const topRef = useRef<Mesh>(null);
  const [laserTarget, setLaserTarget] = useState<Vector3 | null>(null);
  const lastFired = useRef<number>(0);

  const isGatling = data.type === 'Gatling';
  const upgrade = data.upgrade ?? 'default';
  const tc = theme.unitColors.tower;

  let range = isGatling ? 3.0 : 5.0;
  let fireRate = isGatling ? 0.3 : 2.5;
  let damage = isGatling ? 2 : 15;
  let aoeRadius = isGatling ? 0 : 2.0;
  let tracerColor = isGatling ? tc.tracerDefault : tc.tracerDefault;
  if (isGatling) {
    if (upgrade === 'rapid') { fireRate = 0.15; damage = 2; tracerColor = tc.tracerRapid; }
    else if (upgrade === 'pierce') { damage = 4; fireRate = 0.35; tracerColor = tc.tracerPierce; }
    else tracerColor = tc.tracerDefault;
  } else {
    if (upgrade === 'bigBoom') { aoeRadius = 3.0; damage = 12; tracerColor = tc.tracerBigBoom; }
    else if (upgrade === 'shrapnel') { aoeRadius = 1.5; damage = 22; tracerColor = tc.tracerShrapnel; }
    else tracerColor = tc.tracerDefault;
  }

  useFrame((state, delta) => {
    const { runState, enemies, selectedTargetMode, endPoint, gridSize } = useGameStore.getState();
    if (runState === 'PAUSED' || runState === 'GAME_OVER') return;

    const now = state.clock.getElapsedTime();
    const toWorld = (c: number) => c - gridSize / 2 + 0.5;
    const goal = new Vector3(toWorld(endPoint.x), 0.5, toWorld(endPoint.z));

    if (laserTarget && now - lastFired.current > 0.1) {
      setLaserTarget(null);
    }

    if (topRef.current) {
      const timeSinceFire = now - lastFired.current;
      if (timeSinceFire < 0.1) {
        topRef.current.scale.lerp(new Vector3(1.2, 0.5, 1.2), delta * 30);
      } else {
        topRef.current.scale.lerp(new Vector3(1, 1, 1), delta * 10);
      }
    }

    if (now - lastFired.current < fireRate) return;

    const towerPos = new Vector3(...worldPosition);
    const inRange: { enemy: EnemyData; pos: Vector3; dist: number; distToGoal: number }[] = [];

    for (const enemy of enemies) {
      const ePos = enemyPositions[enemy.id];
      if (!ePos) continue;
      const dist = towerPos.distanceTo(ePos);
      if (dist > range) continue;
      const distToGoal = ePos.distanceTo(goal);
      inRange.push({ enemy, pos: ePos.clone(), dist, distToGoal });
    }

    const chosen = pickTarget(inRange, selectedTargetMode);
    if (!chosen) return;

    let aimPos = chosen.pos.clone();
    if (!isGatling) {
      const dirToGoal = goal.clone().sub(chosen.pos).normalize();
      aimPos.add(dirToGoal.multiplyScalar(chosen.enemy.speed * MORTAR_LEAD_TIME));
    }

    lastFired.current = now;
    setLaserTarget(aimPos);

    if (topRef.current) {
      topRef.current.lookAt(aimPos);
    }

    if (isGatling) {
      audioManager.playLaserSound();
      useGameStore.getState().damageEnemy(chosen.enemy.id, damage);
    } else {
      audioManager.playLaserSound();
      useGameStore.getState().damageEnemiesInRadius([aimPos.x, aimPos.y, aimPos.z], aoeRadius, damage);
    }
  });

  return (
    <group position={worldPosition}>
      {/* Base Pedestal */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.7, 0.3, 0.7]} />
        <meshStandardMaterial color={isGatling ? "#666666" : "#555555"} />
      </mesh>

      {/* Top / Turret Section */}
      <group position={[0, 0.6, 0]} ref={topRef as any}>
        {isGatling ? (
          <group>
            {/* Gatling Body */}
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.4, 0.6]} />
              <meshStandardMaterial color={tc.gatling} />
            </mesh>
            {/* Multi-Barrel Assembly */}
            <group position={[0, 0, 0.4]}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh 
                  key={i} 
                  position={[
                    Math.cos((i * Math.PI * 2) / 6) * 0.12, 
                    Math.sin((i * Math.PI * 2) / 6) * 0.12, 
                    0
                  ]}
                  rotation={[Math.PI / 2, 0, 0]}
                  castShadow
                >
                  <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                  <meshStandardMaterial color="#333333" />
                </mesh>
              ))}
            </group>
          </group>
        ) : (
          <group>
            {/* Mortar Turret Ball */}
            <mesh castShadow>
              <sphereGeometry args={[0.35, 32, 16]} />
              <meshStandardMaterial color={tc.mortar} />
            </mesh>
            {/* Mortar Barrel */}
            <mesh position={[0, 0.1, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.2, 0.6, 24]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>
        )}
      </group>

      {/* Laser beam / Projectile trace */}
      {laserTarget && (
        <Line 
          points={[
            [0, 0.75, 0], 
            [laserTarget.x - worldPosition[0], laserTarget.y - worldPosition[1], laserTarget.z - worldPosition[2]]
          ]} 
          color={tracerColor} 
          lineWidth={isGatling ? 3 : 5}
        />
      )}
    </group>
  );
};
