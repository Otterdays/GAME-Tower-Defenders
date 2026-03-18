import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const WaveManagerUI: React.FC = () => {
  const { 
    wave, 
    isWaveActive, 
    enemiesSpawnedThisWave, 
    enemiesToSpawnThisWave,
    enemies,
    startNextWave,
    setWaveActive
  } = useGameStore();

  const [countdown, setCountdown] = useState(0);

  // Check if wave is over
  useEffect(() => {
    if (isWaveActive) {
      if (enemiesSpawnedThisWave >= enemiesToSpawnThisWave && enemies.length === 0) {
        setWaveActive(false);
        setCountdown(5); // 5 seconds between waves
      }
    }
  }, [isWaveActive, enemiesSpawnedThisWave, enemiesToSpawnThisWave, enemies.length, setWaveActive]);

  const runState = useGameStore((s) => s.runState);

  useEffect(() => {
    if (runState === 'PAUSED' || runState === 'GAME_OVER') return;
    if (!isWaveActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!isWaveActive && countdown === 0 && wave >= 1) {
      startNextWave();
    }
  }, [isWaveActive, countdown, wave, startNextWave, runState]);

  if (isWaveActive || runState === 'GAME_OVER') return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      zIndex: 20,
    }}>
      {wave === 0 && countdown === 0 ? (
        <button 
          onClick={() => startNextWave()}
          style={buttonStyle}
        >
          START WAVE 1
        </button>
      ) : (
        <div style={messageStyle}>
          <h2>Wave Complete!</h2>
          <p>Enemies: {enemiesSpawnedThisWave} / {enemiesToSpawnThisWave} cleared</p>
          <p>Next wave in: {countdown}</p>
          <button 
            onClick={() => {
              setCountdown(0);
              startNextWave();
            }}
            style={{...buttonStyle, fontSize: '18px', padding: '10px 20px'}}
          >
            Start Now
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#ff4757',
  color: 'white',
  border: '4px solid #333',
  borderRadius: '12px',
  padding: '15px 30px',
  fontSize: '24px',
  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0px 6px 0px rgba(0,0,0,0.2)',
  transition: 'transform 0.1s',
};

const messageStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '4px solid #333',
  borderRadius: '16px',
  padding: '20px 40px',
  textAlign: 'center',
  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
  boxShadow: '0px 10px 0px rgba(0,0,0,0.2)',
};
