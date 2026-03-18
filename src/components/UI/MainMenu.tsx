import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../utils/audio/audioManager';
import { SettingsPanel } from './SettingsPanel';
import { MapSelector } from './MapSelector';
import { GalleryOverlay } from './GalleryOverlay';

export const MainMenu: React.FC = () => {
  const { startNewRun, openSettings, closeSettings, openGallery, activeOverlay } = useGameStore();
  const [showMapSelector, setShowMapSelector] = useState(false);

  const handlePlay = () => {
    audioManager.playUISound('select');
    setShowMapSelector(true);
  };

  const handleMapSelect = (mapId: string) => {
    startNewRun(mapId);
    setShowMapSelector(false);
  };

  const handleSettings = () => {
    audioManager.playUISound('select');
    openSettings('menu');
  };

  const handleGallery = () => {
    audioManager.playUISound('select');
    openGallery();
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0d0d12',
      backgroundImage: 'radial-gradient(circle at center, #1a1a2e 0%, #0d0d12 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid Decoration */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(0, 210, 211, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 210, 211, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div className="panel-tactical" style={{ 
        padding: '60px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        zIndex: 1,
        boxShadow: '0 0 50px rgba(0, 210, 211, 0.1)'
      }}>
        <h1 className="tactical-font" style={{ fontSize: '4rem', marginBottom: '10px', color: '#00d2d3', letterSpacing: '8px' }}>
          IRONHOLD
        </h1>
        <div style={{ height: '2px', width: '200px', background: '#00d2d3', marginBottom: '10px' }} />
        <p className="tactical-font" style={{ fontSize: '0.8rem', marginBottom: '60px', opacity: 0.7, letterSpacing: '4px' }}>
          SIEGE PROTOCOLS // V0.5.0
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '250px' }}>
          <button onClick={handlePlay} className="btn-tactical" style={{ padding: '15px' }}>
            INITIATE MISSION
          </button>
          
          <button onClick={handleGallery} className="btn-tactical" style={{ padding: '15px' }}>
            INTEL REPOSITORY
          </button>

          <button onClick={handleSettings} className="btn-tactical" style={{ padding: '15px' }}>
            SYSTEM CONFIG
          </button>
        </div>
      </div>

      <p className="tactical-font" style={{ position: 'absolute', bottom: '20px', fontSize: '0.6rem', opacity: 0.4 }}>
        SYSTEMS ONLINE // TARGETING PROTOCOLS: ACTIVE
      </p>

      {showMapSelector && (
        <MapSelector
          onSelect={handleMapSelect}
          onBack={() => setShowMapSelector(false)}
        />
      )}
      
      {activeOverlay === 'SETTINGS' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <SettingsPanel onClose={closeSettings} />
        </div>
      )}

      {activeOverlay === 'GALLERY' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 200 }}>
          <GalleryOverlay />
        </div>
      )}
    </div>
  );
};
