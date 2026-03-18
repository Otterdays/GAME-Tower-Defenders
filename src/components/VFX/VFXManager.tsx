import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { FloatingTextItem } from './FloatingTextItem';
import { ParticleExplosion } from './ParticleExplosion';

export const VFXManager: React.FC = () => {
  const { floatingTexts, particles, settings } = useGameStore();

  return (
    <group>
      {settings.showFloatingText && floatingTexts.map((ft) => (
        <FloatingTextItem key={ft.id} data={ft} />
      ))}
      {settings.showParticles && particles.map((p) => (
        <ParticleExplosion key={p.id} data={p} />
      ))}
    </group>
  );
};
