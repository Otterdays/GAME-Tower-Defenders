import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import type { Point } from '../store/gameStore';
import { findPath } from '../utils/pathfinding';
import { Tower } from './Tower';
import { audioManager } from '../utils/audio/audioManager';

const ScanningLine: React.FC<{ size: number }> = ({ size }) => {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * (size / 2);
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, 0.05]} />
      <meshStandardMaterial 
        color="#00d2d3" 
        emissive="#00d2d3" 
        emissiveIntensity={10} 
        toneMapped={false} 
        transparent 
        opacity={0.8} 
      />
    </mesh>
  );
};

export const Grid: React.FC = () => {
  const {
    gridSize,
    startPoint,
    endPoint,
    obstacles,
    towers,
    path,
    gold,
    addGold,
    addTower,
    setPath,
    setNarratorMessage,
    selectedTowerType,
    settings,
  } = useGameStore();

  const [hoveredTile, setHoveredTile] = useState<Point | null>(null);
  const [isHoverValid, setIsHoverValid] = useState(false);

  // Helper to convert logical grid (0 to 9) to world coordinates (-4.5 to 4.5)
  const toWorld = (coord: number) => coord - (gridSize / 2) + 0.5;

  const blocked = React.useMemo(
    () => [...obstacles, ...towers.map((t) => ({ x: t.x, z: t.z }))],
    [obstacles, towers]
  );

  useEffect(() => {
    const newPath = findPath(gridSize, startPoint, endPoint, blocked);
    if (newPath) setPath(newPath);
  }, [gridSize, startPoint, endPoint, blocked, setPath]);

  const getTowerCost = (type: string) => {
    return type === 'Mortar' ? 40 : 20;
  };

  const isObstacle = (x: number, z: number) =>
    obstacles.some((o) => o.x === x && o.z === z);

  const checkValidity = (logicalX: number, logicalZ: number) => {
    if (logicalX < 0 || logicalX >= gridSize || logicalZ < 0 || logicalZ >= gridSize) return false;

    if (isObstacle(logicalX, logicalZ)) return false;

    // Prevent placing on start/end
    if ((logicalX === startPoint.x && logicalZ === startPoint.z) ||
        (logicalX === endPoint.x && logicalZ === endPoint.z)) {
      return false;
    }

    // Check gold
    if (gold < getTowerCost(selectedTowerType)) return false;

    // Prevent placing on existing tower
    if (towers.some(t => t.x === logicalX && t.z === logicalZ)) return false;

    // Test pathfinding with new tower
    const hypotheticalBlocked = [...blocked, { x: logicalX, z: logicalZ }];
    const newPath = findPath(gridSize, startPoint, endPoint, hypotheticalBlocked);

    if (!newPath) return false;

    return true;
  };

  const handlePointerMove = (event: any) => {
    event.stopPropagation();
    const point = event.point;

    const logicalX = Math.round(point.x + (gridSize / 2) - 0.5);
    const logicalZ = Math.round(point.z + (gridSize / 2) - 0.5);

    if (hoveredTile?.x !== logicalX || hoveredTile?.z !== logicalZ) {
      setHoveredTile({ x: logicalX, z: logicalZ });
      setIsHoverValid(checkValidity(logicalX, logicalZ));
    }
  };

  const handlePointerOut = () => {
    setHoveredTile(null);
  };

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    const point = event.point;

    // Snap world coordinate back to logical grid
    const logicalX = Math.round(point.x + (gridSize / 2) - 0.5);
    const logicalZ = Math.round(point.z + (gridSize / 2) - 0.5);

    // Bounds check
    if (logicalX < 0 || logicalX >= gridSize || logicalZ < 0 || logicalZ >= gridSize) return;

    if (isObstacle(logicalX, logicalZ)) {
      audioManager.playUISound('cancel');
      setNarratorMessage("You can't build on the ruins! That's ancient rubble!");
      return;
    }

    // Prevent placing on start/end
    if ((logicalX === startPoint.x && logicalZ === startPoint.z) ||
        (logicalX === endPoint.x && logicalZ === endPoint.z)) {
      audioManager.playUISound('cancel');
      setNarratorMessage("You can't build on the start or end points! Where would they go?");
      return;
    }

    // Check gold
    const cost = getTowerCost(selectedTowerType);
    if (gold < cost) {
      audioManager.playUISound('cancel');
      setNarratorMessage(`Not enough gold! You need ${cost} gold for a ${selectedTowerType} tower.`);
      return;
    }

    // Prevent placing on existing tower
    if (towers.some(t => t.x === logicalX && t.z === logicalZ)) {
       audioManager.playUISound('cancel');
       setNarratorMessage("Whoops! You can't build on top of an existing tower, silly!");
       return;
    }

    // Test pathfinding with new tower
    const hypotheticalBlocked = [...blocked, { x: logicalX, z: logicalZ }];
    const newPath = findPath(gridSize, startPoint, endPoint, hypotheticalBlocked);

    if (!newPath) {
      audioManager.playUISound('cancel');
      setNarratorMessage("Hey! You can't completely block the path! They need SOMEWHERE to go!");
      return;
    }

    // Valid placement
    audioManager.playUISound('place');
    addGold(-cost);
    addTower({ x: logicalX, z: logicalZ, type: selectedTowerType });
    setPath(newPath);
    setHoveredTile(null);

    const messages = [
      `A new ${selectedTowerType} deployed!`,
      "Splendid placement! Right in the line of sight!",
      "A bold strategic maneuver!",
      "I wouldn't have put it there, but what do I know?",
    ];
    setNarratorMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <group>
      {/* Tactical Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        receiveShadow
      >
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial color="#2d3436" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Grid Pattern Overlay */}
      <gridHelper args={[gridSize, gridSize, '#1e272e', '#485460']} position={[0, -0.09, 0]} />

      <ScanningLine size={gridSize} />
      {hoveredTile && <pointLight position={[toWorld(hoveredTile.x), 1, toWorld(hoveredTile.z)]} intensity={1.5} color={isHoverValid ? '#00d2d3' : '#ff7675'} distance={4} />}

      {/* Placement Hologram */}
      {hoveredTile && (
        <group position={[toWorld(hoveredTile.x), 0.5, toWorld(hoveredTile.z)]}>
          <group scale={[1, 1, 1]}>
             {/* Hologram Base */}
             <mesh castShadow>
               <boxGeometry args={[0.9, 0.4, 0.9]} />
               <meshStandardMaterial 
                 color={isHoverValid ? '#00d2d3' : '#ff7675'} 
                 emissive={isHoverValid ? '#00d2d3' : '#ff7675'}
                 emissiveIntensity={1}
                 toneMapped={false}
                 transparent 
                 opacity={0.3} 
               />
             </mesh>
             {/* Hologram Top */}
             <mesh position={[0, 0.6, 0]}>
               {selectedTowerType === 'Gatling' ? (
                  <cylinderGeometry args={[0.2, 0.4, 0.5, 32]} />
               ) : (
                  <sphereGeometry args={[0.35, 32, 16]} />
               )}
               <meshStandardMaterial 
                 color={isHoverValid ? '#00d2d3' : '#ff7675'} 
                 emissive={isHoverValid ? '#00d2d3' : '#ff7675'}
                 emissiveIntensity={isHoverValid ? 3 : 1}
                 toneMapped={false}
                 transparent 
                 opacity={0.4} 
               />
             </mesh>
          </group>
        </group>
      )}

      {/* Pulse-Pylon: Start Point */}
      <group position={[toWorld(startPoint.x), 0, toWorld(startPoint.z)]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.1, 32]} />
          <meshStandardMaterial color="#341f97" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 32]} />
          <meshStandardMaterial 
            color="#54a0ff" 
            emissive="#54a0ff" 
            emissiveIntensity={8} 
            toneMapped={false} 
          />
        </mesh>
        <pointLight color="#54a0ff" intensity={1} distance={3} />
      </group>

      {/* Pulse-Pylon: End Point */}
      <group position={[toWorld(endPoint.x), 0, toWorld(endPoint.z)]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.1, 32]} />
          <meshStandardMaterial color="#b33939" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.6, 32]} />
          <meshStandardMaterial 
            color="#ff5252" 
            emissive="#ff5252" 
            emissiveIntensity={8} 
            toneMapped={false} 
          />
        </mesh>
        <pointLight color="#ff5252" intensity={1} distance={3} />
      </group>

      {/* Obstacles */}
      {obstacles.map((o, idx) => (
        <mesh
          key={`obs-${idx}`}
          position={[toWorld(o.x), 0.15, toWorld(o.z)]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.85, 0.4, 0.85]} />
          <meshStandardMaterial color="#4a4a4a" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {/* Path Preview */}
      {settings.showPathPreview && path.map((p, idx) => (
        <mesh key={`path-${idx}`} position={[toWorld(p.x), -0.08, toWorld(p.z)]}>
          <boxGeometry args={[0.4, 0.02, 0.4]} />
          <meshStandardMaterial 
            color="#00d2d3" 
            emissive="#00d2d3" 
            emissiveIntensity={2} 
            toneMapped={false}
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}

      {/* Placed Towers */}
      {towers.map((tower) => (
        <Tower
          key={tower.id}
          data={tower}
          worldPosition={[toWorld(tower.x), 0.5, toWorld(tower.z)]}
        />
      ))}
    </group>
  );
};
