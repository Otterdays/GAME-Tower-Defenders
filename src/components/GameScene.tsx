import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Grid } from './Grid';
import { EnemyManager } from './EnemyManager';
import { NarratorOverlay } from './UI/NarratorOverlay';
import { HUD } from './UI/HUD';
import { CameraRig } from './UI/CameraRig';
import { VFXManager } from './VFX/VFXManager';
import { WaveManagerUI } from './UI/WaveManagerUI';
import { PauseOverlay } from './UI/PauseOverlay';
import { SettingsPanel } from './UI/SettingsPanel';
import { GameOverOverlay } from './UI/GameOverOverlay';
import { useGameStore } from '../store/gameStore';
import {
  ENV_PALETTE,
  ENV_LIGHTING,
  ENV_POST,
  getFogArgs,
} from '../constants/environment';

export const GameScene: React.FC = () => {
  const { activeOverlay, runState, closeSettings } = useGameStore();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: ENV_PALETTE.background,
    }}>
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 45 }} gl={{ antialias: false, toneMappingExposure: 1 }}>
        <CameraRig />
        <ambientLight intensity={ENV_LIGHTING.ambient.intensity} />
        <directionalLight
          position={ENV_LIGHTING.directional.position}
          intensity={ENV_LIGHTING.directional.intensity}
          castShadow
          shadow-mapSize={[ENV_LIGHTING.directional.shadowMapSize, ENV_LIGHTING.directional.shadowMapSize]}
        />
        <fog attach="fog" args={getFogArgs()} />

        <Grid />
        <EnemyManager />
        <VFXManager />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={ENV_POST.bloom.luminanceThreshold}
            mipmapBlur={ENV_POST.bloom.mipmapBlur}
            intensity={ENV_POST.bloom.intensity}
            radius={ENV_POST.bloom.radius}
          />
          <Vignette
            eskil={ENV_POST.vignette.eskil}
            offset={ENV_POST.vignette.offset}
            darkness={ENV_POST.vignette.darkness}
          />
        </EffectComposer>
      </Canvas>

      <HUD />
      <WaveManagerUI />
      <NarratorOverlay />
      
      {activeOverlay === 'PAUSE' && runState === 'PAUSED' && <PauseOverlay />}
      {activeOverlay === 'SETTINGS' && runState === 'PAUSED' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60 }}>
          <SettingsPanel onClose={closeSettings} />
        </div>
      )}
      {activeOverlay === 'GAME_OVER' && runState === 'GAME_OVER' && <GameOverOverlay />}
    </div>
  );
};
