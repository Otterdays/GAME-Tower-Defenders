import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import type { ParticleData } from '../../store/gameStore';

export const ParticleExplosion: React.FC<{ data: ParticleData }> = ({ data }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { removeParticle } = useGameStore();
  const lifetime = 0.5; // seconds
  const particleCount = 8;

  // Generate random directions for particles once
  const directions = useMemo(() => {
    const dirs = [];
    for (let i = 0; i < particleCount; i++) {
      dirs.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 4,
        (Math.random() - 0.5) * 4
      ));
    }
    return dirs;
  }, []);

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    if (!groupRef.current) return;
    const age = (Date.now() - data.timestamp) / 1000;
    
    if (age > lifetime) {
      removeParticle(data.id);
      return;
    }

    const scale = 1 - (age / lifetime); // shrink over time

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.position.addScaledVector(directions[i], 0.016); // basic velocity
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef} position={new THREE.Vector3(...data.position)}>
      {directions.map((_, i) => (
        <mesh 
          key={i} 
          ref={(el) => { if (el) meshRefs.current[i] = el; }}
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={data.color} />
        </mesh>
      ))}
    </group>
  );
};
