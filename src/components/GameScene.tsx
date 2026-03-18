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
import { useThemeRuntime, getFogArgsFromRuntime } from '../constants/themeRuntime';

export const GameScene: React.FC = () => {
  const { activeOverlay, runState, closeSettings } = useGameStore();
  const theme = useThemeRuntime();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: theme.palette.background,
    }}>
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 45 }} gl={{ antialias: false, toneMappingExposure: 1 }}>
        <CameraRig />
        <ambientLight intensity={theme.lighting.ambient.intensity} />
        <directionalLight
          position={theme.lighting.directional.position}
          intensity={theme.lighting.directional.intensity}
          castShadow
          shadow-mapSize={[theme.lighting.directional.shadowMapSize, theme.lighting.directional.shadowMapSize]}
        />
        <fog attach="fog" args={getFogArgsFromRuntime(theme)} />

        <Grid theme={theme} />
        <EnemyManager />
        <VFXManager />

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={theme.post.bloom.luminanceThreshold}
            mipmapBlur={theme.post.bloom.mipmapBlur}
            intensity={theme.post.bloom.intensity}
            radius={theme.post.bloom.radius}
          />
          <Vignette
            eskil={theme.post.vignette.eskil}
            offset={theme.post.vignette.offset}
            darkness={theme.post.vignette.darkness}
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
