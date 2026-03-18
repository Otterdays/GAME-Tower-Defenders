import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh, MeshStandardMaterial, Color, Group } from 'three';
import { useGameStore, enemyPositions } from '../store/gameStore';
import type { EnemyData } from '../store/gameStore';
import { audioManager } from '../utils/audio/audioManager';
import { useThemeRuntime } from '../constants/themeRuntime';

const HIT_COLOR = new Color('#ffffff');

export const Enemy: React.FC<{ data: EnemyData }> = ({ data }) => {
  const { path, gridSize, removeEnemy, loseHealth, setNarratorMessage, endPoint, runState } = useGameStore();
  const theme = useThemeRuntime();
  const enemyRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const lastHp = useRef(data.hp);
  const flashTimer = useRef(0);
  
  const [targetIndex, setTargetIndex] = useState(1);
  const toWorld = (coord: number) => coord - (gridSize / 2) + 0.5;

  const baseColor = React.useMemo(() => {
    const hex = theme.unitColors.enemy[data.type] ?? '#ff4500';
    return new Color(hex);
  }, [data.type, theme.unitColors]);

  // Initialize position to the start of the path
  useEffect(() => {
    if (enemyRef.current && path.length > 0) {
      const startY = data.type === 'Flying' ? 2.0 : 0.5;
      enemyRef.current.position.set(toWorld(path[0].x), startY, toWorld(path[0].z));
      enemyPositions[data.id] = enemyRef.current.position.clone();
    }
    
    return () => {
      delete enemyPositions[data.id];
    };
  }, []); // Run once on mount

  // If path changes, try to find the closest node in the new path to continue from
  useEffect(() => {
    if (enemyRef.current && path.length > 0 && data.type !== 'Flying') {
      const currentPos = enemyRef.current.position;
      let closestIdx = 0;
      let minDistance = Infinity;
      
      for (let i = 0; i < path.length; i++) {
        const pPos = new Vector3(toWorld(path[i].x), 0.5, toWorld(path[i].z));
        const dist = currentPos.distanceTo(pPos);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }
      
      // Target the NEXT node after the closest one, if possible
      setTargetIndex(Math.min(closestIdx + 1, path.length - 1));
    }
  }, [path, gridSize, data.type]);

  // Check for hits
  useEffect(() => {
    if (data.hp < lastHp.current) {
      // Took damage!
      flashTimer.current = 0.15; // flash for 150ms
      audioManager.playImpactSound();
    }
    lastHp.current = data.hp;
  }, [data.hp]);

  useFrame((state, delta) => {
    if (!enemyRef.current) return;
    if (runState === 'PAUSED' || runState === 'GAME_OVER') return;
    if (path.length === 0 && data.type !== 'Flying') return;

    // Handle hit flash
    if (materialRef.current) {
      if (flashTimer.current > 0) {
        flashTimer.current -= delta;
        materialRef.current.color.copy(HIT_COLOR);
      } else {
        materialRef.current.color.lerp(baseColor, delta * 10);
      }
    }

    const currentPos = enemyRef.current.position;
    const targetPos = new Vector3();
    let isEnd = false;

    if (data.type === 'Flying') {
      targetPos.set(toWorld(endPoint.x), 2.0, toWorld(endPoint.z));
      // 2D distance to target
      const dist2D = Math.hypot(targetPos.x - currentPos.x, targetPos.z - currentPos.z);
      if (dist2D < 0.1) {
        isEnd = true;
      }
    } else {
      const safeTargetIndex = Math.min(targetIndex, path.length - 1);
      const targetLogic = path[safeTargetIndex];
      if (!targetLogic) return;

      targetPos.set(toWorld(targetLogic.x), 0.5, toWorld(targetLogic.z));
      const distance = currentPos.distanceTo(targetPos);

      if (distance < 0.1) {
        if (safeTargetIndex === path.length - 1) {
          isEnd = true;
        } else {
          setTargetIndex(safeTargetIndex + 1);
          // Return early to calculate new direction next frame
          return;
        }
      }
    }

    if (isEnd) {
      removeEnemy(data.id);
      loseHealth(1);
      setNarratorMessage("Ouch! One got through! They're stepping all over the tulips!");
    } else {
      // Ensure targetPos is updated to latest logic node if standard/tank
      if (data.type !== 'Flying') {
        const safeTargetIndex = Math.min(targetIndex, path.length - 1);
        const targetLogic = path[safeTargetIndex];
        if (targetLogic) {
          targetPos.set(toWorld(targetLogic.x), 0.5, toWorld(targetLogic.z));
        }
      }

      const dir = targetPos.clone().sub(currentPos).normalize();
      
      // Local avoidance (only applied for ground units to keep flying ones straight and true)
      const avoidance = new Vector3(0, 0, 0);
      if (data.type !== 'Flying') {
        const avoidanceRadius = 0.6;
        for (const [otherId, otherPos] of Object.entries(enemyPositions)) {
          if (otherId === data.id) continue;
          const dist = currentPos.distanceTo(otherPos);
          if (dist < avoidanceRadius && dist > 0) {
            const pushDir = currentPos.clone().sub(otherPos).normalize();
            const pushStrength = (avoidanceRadius - dist) / avoidanceRadius;
            avoidance.add(pushDir.multiplyScalar(pushStrength * 1.5));
          }
        }
        avoidance.y = 0; // Stay flat
      }
      
      const finalVelocity = dir.multiplyScalar(data.speed).add(avoidance);
      currentPos.add(finalVelocity.multiplyScalar(delta));
      
      const time = state.clock.getElapsedTime();
      if (data.type === 'Flying') {
        currentPos.y = 2.0 + Math.sin(time * 5) * 0.2;
        
        // Point the cone towards movement direction
        const lookTarget = currentPos.clone().add(dir);
        lookTarget.y = currentPos.y; // keep it level
        enemyRef.current.lookAt(lookTarget);
        enemyRef.current.rotateX(Math.PI / 2); // adjust cone geometry orientation
      } else {
        const bounce = Math.abs(Math.sin(time * 10 * data.speed));
        const baseY = data.type === 'Tank' ? 0.2 : data.type === 'Runner' || data.type === 'Swarm' ? 0.4 : 0.5;
        const bounceAmt = data.type === 'Tank' ? 0.05 : data.type === 'Runner' || data.type === 'Swarm' ? 0.15 : 0.2;
        currentPos.y = baseY + bounce * bounceAmt;

        const stretch = 1 + bounce * 0.2;
        const squash = 1 - bounce * 0.1;
        enemyRef.current.scale.set(squash, stretch, squash);
      }
    }
    
    // Update global position tracker
    enemyPositions[data.id] = currentPos.clone();
  });

  // --- ANIMATION REFS ---
  const rotorRef = useRef<Group>(null);
  const antennaRef = useRef<Mesh>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const bruteLeftArmRef = useRef<Group>(null);
  const bruteRightArmRef = useRef<Group>(null);
  const bruteLeftLegRef = useRef<Group>(null);
  const bruteRightLegRef = useRef<Group>(null);
  const swarmLegRefs = useRef<(Group | null)[]>([null, null, null, null]);
  const tankLegRefs = useRef<(Group | null)[]>([null, null]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const walkSpeed = data.speed * 8;
    const legSwing = 0.35;
    const armSwing = 0.35;

    if (rotorRef.current) rotorRef.current.rotation.y += 0.5;
    if (antennaRef.current) antennaRef.current.rotation.z = Math.sin(t * 15) * 0.3;

    // Biped walk cycle (Standard, Runner)
    if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * walkSpeed) * legSwing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t * walkSpeed) * legSwing;
    if (leftArmRef.current) leftArmRef.current.rotation.y = -Math.sin(t * walkSpeed) * armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.y = Math.sin(t * walkSpeed) * armSwing;

    // Brute walk cycle
    if (bruteLeftLegRef.current) bruteLeftLegRef.current.rotation.x = Math.sin(t * walkSpeed * 0.7) * 0.25;
    if (bruteRightLegRef.current) bruteRightLegRef.current.rotation.x = -Math.sin(t * walkSpeed * 0.7) * 0.25;
    if (bruteLeftArmRef.current) bruteLeftArmRef.current.rotation.y = -Math.sin(t * walkSpeed * 0.7) * 0.2;
    if (bruteRightArmRef.current) bruteRightArmRef.current.rotation.y = Math.sin(t * walkSpeed * 0.7) * 0.2;

    // Swarm spider legs (alternating pairs, forward/back swing)
    swarmLegRefs.current.forEach((ref, i) => {
      if (ref) ref.rotation.x = (i % 2 === 0 ? 1 : -1) * Math.sin(t * walkSpeed * 1.5) * 0.4;
    });

    // Tank stumpy legs (piston pump)
    tankLegRefs.current.forEach((ref, i) => {
      if (ref) ref.rotation.x = (i % 2 === 0 ? 1 : -1) * Math.sin(t * walkSpeed * 0.5) * 0.15;
    });
  });

  const hpPercentage = data.hp / data.maxHp;
  const meshScale = data.type === 'Tank' ? 1.5 : data.type === 'Brute' ? 1.3 : data.type === 'Runner' || data.type === 'Swarm' ? 0.75 : 1;
  const hpY = data.type === 'Flying' ? 2.8 : 0.8;

  const renderModel = () => {
    const type = data.type;
    switch (type) {
      case 'Tank':
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.4, 0.8]} />
              <meshStandardMaterial ref={materialRef} color={baseColor} roughness={0.6} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.6, 0.2, 0.6]} />
              <meshStandardMaterial color="#222" roughness={0.4} metalness={0.9} />
            </mesh>
            {/* Treads (main locomotion) */}
            <group position={[0, -0.15, 0]}>
              <mesh position={[0.35, 0, 0]}>
                <boxGeometry args={[0.15, 0.2, 0.9]} />
                <meshStandardMaterial color="#111" />
              </mesh>
              <mesh position={[-0.35, 0, 0]}>
                <boxGeometry args={[0.15, 0.2, 0.9]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            </group>
            {/* Stumpy piston legs — front corners */}
            <group ref={(el) => { tankLegRefs.current[0] = el; }} position={[0.35, -0.1, 0.35]} rotation={[0, 0, 0]}>
              <mesh position={[0, -0.08, 0]}>
                <boxGeometry args={[0.1, 0.15, 0.1]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            </group>
            <group ref={(el) => { tankLegRefs.current[1] = el; }} position={[-0.35, -0.1, 0.35]} rotation={[0, 0, 0]}>
              <mesh position={[0, -0.08, 0]}>
                <boxGeometry args={[0.1, 0.15, 0.1]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            </group>
            <mesh position={[0, 0.1, 0.35]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={5} toneMapped={false} />
            </mesh>
          </group>
        );
      case 'Flying':
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, 0.8, 32]} />
              <meshStandardMaterial ref={materialRef} color={baseColor} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 0.05, 0.3]} />
              <meshStandardMaterial color="#57606f" />
            </mesh>
            <group ref={rotorRef} position={[0, 0.15, 0]}>
              <mesh>
                <boxGeometry args={[0.05, 0.02, 0.6]} />
                <meshStandardMaterial color="#111" />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[0.05, 0.02, 0.6]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            </group>
            <mesh position={[0, 0, -0.4]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#70a1ff" emissive="#70a1ff" emissiveIntensity={8} toneMapped={false} />
            </mesh>
          </group>
        );
      case 'Runner':
      case 'Standard':
        return (
          <group>
            <mesh castShadow>
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial ref={materialRef} color={baseColor} roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Legs — biped, hip at sides */}
            <group ref={leftLegRef} position={[-0.22, -0.15, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0, -0.18, 0]}>
                <boxGeometry args={[0.08, 0.35, 0.08]} />
                <meshStandardMaterial color="#2f3542" />
              </mesh>
            </group>
            <group ref={rightLegRef} position={[0.22, -0.15, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0, -0.18, 0]}>
                <boxGeometry args={[0.08, 0.35, 0.08]} />
                <meshStandardMaterial color="#2f3542" />
              </mesh>
            </group>
            {/* Arms — shoulder height, swing with walk */}
            <group ref={leftArmRef} position={[-0.3, 0.1, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0, 0, 0.12]}>
                <boxGeometry args={[0.06, 0.06, 0.24]} />
                <meshStandardMaterial color="#2f3542" />
              </mesh>
            </group>
            <group ref={rightArmRef} position={[0.3, 0.1, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0, 0, 0.12]}>
                <boxGeometry args={[0.06, 0.06, 0.24]} />
                <meshStandardMaterial color="#2f3542" />
              </mesh>
            </group>
            <mesh position={[0, 0.1, 0.25]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#1e90ff" emissive="#1e90ff" emissiveIntensity={5} toneMapped={false} />
            </mesh>
            <group position={[0, 0.3, 0]}>
              <mesh ref={antennaRef as any}>
                <boxGeometry args={[0.02, 0.3, 0.02]} />
                <meshStandardMaterial color="#111" />
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#1e90ff" emissive="#1e90ff" emissiveIntensity={10} toneMapped={false} />
              </mesh>
            </group>
          </group>
        );
      case 'Swarm':
        return (
          <group>
            <mesh castShadow>
              <octahedronGeometry args={[0.3]} />
              <meshStandardMaterial ref={materialRef} color={baseColor} roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
              <octahedronGeometry args={[0.3]} />
              <meshStandardMaterial color="#ffa502" transparent opacity={0.3} wireframe />
            </mesh>
            {/* Spider legs — 4 corners, alternating walk */}
            {[
              [-0.25, -0.2, 0.25],
              [0.25, -0.2, 0.25],
              [0.25, -0.2, -0.25],
              [-0.25, -0.2, -0.25],
            ].map((pos, i) => (
              <group key={i} ref={(el) => { swarmLegRefs.current[i] = el; }} position={pos as [number, number, number]} rotation={[0, 0, 0]}>
                <mesh position={[0, -0.12, 0]}>
                  <boxGeometry args={[0.04, 0.22, 0.04]} />
                  <meshStandardMaterial color="#2f3542" />
                </mesh>
              </group>
            ))}
          </group>
        );
      case 'Brute':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial ref={materialRef} color={baseColor} roughness={0.8} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.2, 0.45]}>
              <boxGeometry args={[0.7, 0.2, 0.1]} />
              <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={10} toneMapped={false} />
            </mesh>
            {/* Arms — animated */}
            <group ref={bruteLeftArmRef} position={[-0.55, 0.35, 0]} rotation={[0, 0, 0]}>
              <mesh position={[-0.15, 0, 0]}>
                <boxGeometry args={[0.3, 0.25, 0.5]} />
                <meshStandardMaterial color="#747d8c" />
              </mesh>
            </group>
            <group ref={bruteRightArmRef} position={[0.55, 0.35, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0.15, 0, 0]}>
                <boxGeometry args={[0.3, 0.25, 0.5]} />
                <meshStandardMaterial color="#747d8c" />
              </mesh>
            </group>
            {/* Legs — stumpy, animated */}
            <group ref={bruteLeftLegRef} position={[-0.3, -0.35, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.25, 0.4, 0.35]} />
                <meshStandardMaterial color="#2f3542" />
              </mesh>
            </group>
            <group ref={bruteRightLegRef} position={[0.3, -0.35, 0]} rotation={[0, 0, 0]}>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[0.25, 0.4, 0.35]} />
                <meshStandardMaterial color="#2f3542" />
              </mesh>
            </group>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={enemyRef as any}>
      <group scale={[meshScale, meshScale, meshScale]}>
        {renderModel()}
      </group>
      
      {/* HP Bar */}
      <group position={[0, hpY, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.08]} />
            <meshBasicMaterial color="#333" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-0.4 + (0.8 * hpPercentage) / 2, 0, 0.01]}>
          <planeGeometry args={[0.8 * hpPercentage, 0.08]} />
          <meshBasicMaterial color={hpPercentage > 0.5 ? '#00ff00' : hpPercentage > 0.2 ? '#ffff00' : '#ff0000'} />
        </mesh>
      </group>
    </group>
  );
};
