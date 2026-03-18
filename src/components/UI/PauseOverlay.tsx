import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../utils/audio/audioManager';

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 50,
  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '4px solid #333',
  borderRadius: '16px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  boxShadow: '0px 10px 0px rgba(0,0,0,0.2)',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 28px',
  fontSize: '20px',
  fontWeight: 'bold',
  backgroundColor: '#ffb347',
  color: '#333',
  border: '4px solid #333',
  borderRadius: '12px',
  cursor: 'pointer',
  boxShadow: '0px 4px 0px rgba(0,0,0,0.2)',
  fontFamily: 'inherit',
  minWidth: '200px',
};

export const PauseOverlay: React.FC = () => {
  const { resumeGame, openSettings, restartRun, returnToMenu } = useGameStore();

  const handleResume = () => {
    audioManager.playUISound('select');
    resumeGame();
  };
  const handleSettings = () => {
    audioManager.playUISound('select');
    openSettings('pause');
  };
  const handleRestart = () => {
    audioManager.playUISound('select');
    restartRun();
  };
  const handleMenu = () => {
    audioManager.playUISound('select');
    returnToMenu();
  };

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>Paused</h2>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Press Esc to resume</p>
        <button onClick={handleResume} style={buttonStyle}>
          Resume
        </button>
        <button onClick={handleSettings} style={buttonStyle}>
          Settings
        </button>
        <button onClick={handleRestart} style={buttonStyle}>
          Restart Run
        </button>
        <button onClick={handleMenu} style={{ ...buttonStyle, backgroundColor: '#ff6b6b' }}>
          Return to Menu
        </button>
      </div>
    </div>
  );
};
