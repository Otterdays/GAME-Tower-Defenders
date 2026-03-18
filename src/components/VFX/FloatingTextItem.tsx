import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import type { FloatingTextData } from '../../store/gameStore';
import * as THREE from 'three';

export const FloatingTextItem: React.FC<{ data: FloatingTextData }> = ({ data }) => {
  const ref = useRef<THREE.Group>(null);
  const { removeFloatingText } = useGameStore();
  const lifetime = 1.0; // seconds

  useFrame((state) => {
    if (!ref.current) return;
    const age = (Date.now() - data.timestamp) / 1000;
    
    if (age > lifetime) {
      removeFloatingText(data.id);
      return;
    }

    // Float upwards
    ref.current.position.y = data.position[1] + (age * 1.5);
    
    // Scale down slightly at the end
    const scale = 1 - (age / lifetime) * 0.5;
    ref.current.scale.setScalar(scale);

    // Make it always face camera
    ref.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={ref} position={new THREE.Vector3(...data.position)}>
      <Text
        color={data.color}
        fontSize={0.3}
        maxWidth={2}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign={'center'}
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {data.text}
      </Text>
    </group>
  );
};
