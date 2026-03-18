import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { getAllThemes } from '../../data/themes_database';

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '4px solid #333',
  borderRadius: '16px',
  padding: '24px 32px',
  minWidth: '320px',
  maxWidth: '90vw',
  boxShadow: '0px 10px 0px rgba(0,0,0,0.2)',
  zIndex: 100,
  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
  gap: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: '18px',
  fontWeight: 'bold',
  backgroundColor: '#ffb347',
  color: '#333',
  border: '4px solid #333',
  borderRadius: '12px',
  cursor: 'pointer',
  boxShadow: '0px 4px 0px rgba(0,0,0,0.2)',
  fontFamily: 'inherit',
};

export const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, setMasterVolume, setMuted, updateVisualSetting, setSelectedTheme } = useGameStore();
  const themes = getAllThemes();

  return (
    <div style={panelStyle}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '28px', color: '#333' }}>Settings</h2>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Theme</span>
        <select
          value={settings.selectedThemeId}
          onChange={(e) => setSelectedTheme(e.target.value as typeof settings.selectedThemeId)}
          style={{ ...buttonStyle, padding: '6px 12px', fontSize: '14px', minWidth: '140px' }}
        >
          <option value="map_default">Map Default</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Mute</span>
        <button
          onClick={() => setMuted(!settings.isMuted)}
          style={{ ...buttonStyle, padding: '6px 16px', fontSize: '14px', backgroundColor: settings.isMuted ? '#ff4d4d' : '#90EE90' }}
        >
          {settings.isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Master Volume</span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(settings.masterVolume * 100)}
          onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
          style={{ width: '120px' }}
        />
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Screen Shake</span>
        <button
          onClick={() => updateVisualSetting('screenShake', !settings.screenShake)}
          style={{ ...buttonStyle, padding: '6px 16px', fontSize: '14px', backgroundColor: settings.screenShake ? '#90EE90' : '#ccc' }}
        >
          {settings.screenShake ? 'On' : 'Off'}
        </button>
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Show Particles</span>
        <button
          onClick={() => updateVisualSetting('showParticles', !settings.showParticles)}
          style={{ ...buttonStyle, padding: '6px 16px', fontSize: '14px', backgroundColor: settings.showParticles ? '#90EE90' : '#ccc' }}
        >
          {settings.showParticles ? 'On' : 'Off'}
        </button>
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Floating Damage Text</span>
        <button
          onClick={() => updateVisualSetting('showFloatingText', !settings.showFloatingText)}
          style={{ ...buttonStyle, padding: '6px 16px', fontSize: '14px', backgroundColor: settings.showFloatingText ? '#90EE90' : '#ccc' }}
        >
          {settings.showFloatingText ? 'On' : 'Off'}
        </button>
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Path Preview</span>
        <button
          onClick={() => updateVisualSetting('showPathPreview', !settings.showPathPreview)}
          style={{ ...buttonStyle, padding: '6px 16px', fontSize: '14px', backgroundColor: settings.showPathPreview ? '#90EE90' : '#ccc' }}
        >
          {settings.showPathPreview ? 'On' : 'Off'}
        </button>
      </div>

      <div style={rowStyle}>
        <span style={{ fontSize: '16px' }}>Reduced Motion</span>
        <button
          onClick={() => updateVisualSetting('reducedMotion', !settings.reducedMotion)}
          style={{ ...buttonStyle, padding: '6px 16px', fontSize: '14px', backgroundColor: settings.reducedMotion ? '#90EE90' : '#ccc' }}
        >
          {settings.reducedMotion ? 'On' : 'Off'}
        </button>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={buttonStyle}>
          Close (Esc)
        </button>
      </div>
    </div>
  );
};
