import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import type { EnemyType, TowerType } from '../../store/gameStore';

interface GalleryUnitProps {
  type: EnemyType | TowerType;
  category: 'enemy' | 'tower';
}

export const GalleryUnit: React.FC<GalleryUnitProps> = ({ type, category }) => {
  const rotorRef = useRef<Group>(null);
  const antennaRef = useRef<Mesh>(null);
  const topRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rotorRef.current) rotorRef.current.rotation.y += 0.5;
    if (antennaRef.current) antennaRef.current.rotation.z = Math.sin(t * 15) * 0.3;
    if (topRef.current && category === 'tower') {
      topRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }
  });

  const renderEnemy = () => {
    switch (type) {
      case 'Tank':
        return (
          <group>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.4, 0.8]} />
              <meshStandardMaterial color="#444" roughness={0.6} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.6, 0.2, 0.6]} />
              <meshStandardMaterial color="#222" roughness={0.4} metalness={0.9} />
            </mesh>
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
              <meshStandardMaterial color="#2f3542" roughness={0.3} metalness={0.8} />
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
              <meshStandardMaterial color={type === 'Runner' ? '#2ed573' : '#3742fa'} roughness={0.4} metalness={0.6} />
            </mesh>
            <group position={[0, -0.2, 0]}>
              {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[Math.cos(i * Math.PI/2) * 0.4, 0, Math.sin(i * Math.PI/2) * 0.4]}>
                  <boxGeometry args={[0.1, 0.2, 0.1]} />
                  <meshStandardMaterial color="#2f3542" />
                </mesh>
              ))}
            </group>
            <mesh position={[0, 0.1, 0.25]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#1e90ff" emissive="#1e90ff" emissiveIntensity={5} toneMapped={false} />
            </mesh>
            <group position={[0, 0.3, 0]}>
              <mesh ref={antennaRef}>
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
              <meshStandardMaterial color="#ffa502" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
              <octahedronGeometry args={[0.3]} />
              <meshStandardMaterial color="#ffa502" transparent opacity={0.3} wireframe />
            </mesh>
          </group>
        );
      case 'Brute':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial color="#2f3542" roughness={0.8} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.2, 0.45]}>
              <boxGeometry args={[0.7, 0.2, 0.1]} />
              <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={10} toneMapped={false} />
            </mesh>
            <mesh position={[0.5, 0.4, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.6]} />
              <meshStandardMaterial color="#747d8c" />
            </mesh>
            <mesh position={[-0.5, 0.4, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.6]} />
              <meshStandardMaterial color="#747d8c" />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  const renderTower = () => {
    const isGatling = type === 'Gatling';
    return (
      <group>
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
        <group position={[0, 0.6, 0]} ref={topRef}>
          {isGatling ? (
            <group>
              <mesh castShadow>
                <boxGeometry args={[0.4, 0.4, 0.6]} />
                <meshStandardMaterial color="#ff1493" />
              </mesh>
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
              <mesh castShadow>
                <sphereGeometry args={[0.35, 32, 16]} />
                <meshStandardMaterial color="#ff4500" />
              </mesh>
              <mesh position={[0, 0.1, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 0.6, 24]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
            </group>
          )}
        </group>
      </group>
    );
  };

  return category === 'enemy' ? renderEnemy() : renderTower();
};
