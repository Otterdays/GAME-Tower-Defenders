import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import * as THREE from 'three';

export const CameraRig: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { lastBaseHit, runState, settings } = useGameStore();
  const shakeOffset = useRef(new THREE.Vector3());
  const basePosition = useRef(new THREE.Vector3(0, 10, 10));

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    if (runState === 'PAUSED' || runState === 'GAME_OVER') return;

    const timeSinceHit = (Date.now() - lastBaseHit) / 1000;

    if (settings.screenShake && timeSinceHit < 0.5) {
      const intensity = (0.5 - timeSinceHit) * 2; // decay over 0.5s
      shakeOffset.current.set(
        (Math.random() - 0.5) * intensity * 0.5,
        (Math.random() - 0.5) * intensity * 0.5,
        (Math.random() - 0.5) * intensity * 0.5
      );
    } else {
      shakeOffset.current.lerp(new THREE.Vector3(0, 0, 0), delta * 10);
    }

    cameraRef.current.position.copy(basePosition.current).add(shakeOffset.current);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 10, 10]} fov={50} />
      <OrbitControls 
        camera={cameraRef.current || undefined}
        target={[0, 0, 0]} 
        maxPolarAngle={Math.PI / 2.5} 
        minDistance={5} 
        maxDistance={20} 
        onChange={(e) => {
          if (cameraRef.current && e?.target?.object) {
             basePosition.current.copy(e.target.object.position);
          }
        }}
      />
    </>
  );
};
