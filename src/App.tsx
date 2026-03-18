import { useEffect } from 'react';
import { GameScene } from './components/GameScene';
import { MainMenu } from './components/UI/MainMenu';
import { useGameStore } from './store/gameStore';
import { audioManager } from './utils/audio/audioManager';

function App() {
  const screen = useGameStore((state) => state.screen);
  const loadSettings = useGameStore((state) => state.loadSettings);
  const settings = useGameStore((state) => state.settings);
  const { activeOverlay, runState, pauseGame, resumeGame, closeSettings } = useGameStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    audioManager.setVolumeFromStore(settings.masterVolume);
    audioManager.setMutedFromStore(settings.isMuted);
  }, [settings.masterVolume, settings.isMuted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      if (activeOverlay === 'SETTINGS') {
        closeSettings();
        return;
      }

      if (screen !== 'PLAYING') return;

      if (activeOverlay === 'PAUSE') {
        resumeGame();
      } else if (runState === 'WAVE' || runState === 'PRE_WAVE') {
        pauseGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, activeOverlay, runState, pauseGame, resumeGame, closeSettings]);

  return (
    <>
      {screen === 'MENU' && <MainMenu />}
      {screen === 'PLAYING' && <GameScene />}
    </>
  );
}

export default App;
