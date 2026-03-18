import React from 'react';
import { getAllMaps } from '../../data/maps_database';
import { audioManager } from '../../utils/audio/audioManager';

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 90,
  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '4px solid #333',
  borderRadius: '16px',
  padding: '24px 32px',
  minWidth: '320px',
  maxWidth: '90vw',
  boxShadow: '0px 10px 0px rgba(0,0,0,0.2)',
};

const mapButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '14px 20px',
  marginBottom: '10px',
  fontSize: '20px',
  fontWeight: 'bold',
  backgroundColor: '#ffb347',
  color: '#333',
  border: '4px solid #333',
  borderRadius: '12px',
  cursor: 'pointer',
  boxShadow: '0px 4px 0px rgba(0,0,0,0.2)',
  fontFamily: 'inherit',
  textAlign: 'left',
};

interface MapSelectorProps {
  onSelect: (mapId: string) => void;
  onBack: () => void;
}

export const MapSelector: React.FC<MapSelectorProps> = ({ onSelect, onBack }) => {
  const maps = getAllMaps();

  return (
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '28px', color: '#333' }}>Select Map</h2>
        {maps.map((map) => (
          <button
            key={map.id}
            onClick={() => {
              audioManager.playUISound('select');
              onSelect(map.id);
            }}
            style={mapButtonStyle}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1.02)';
              (e.target as HTMLButtonElement).style.backgroundColor = '#ffc966';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              (e.target as HTMLButtonElement).style.backgroundColor = '#ffb347';
            }}
          >
            <strong>Map {map.order}: {map.name}</strong>
            {map.description && (
              <div style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '4px', opacity: 0.9 }}>
                {map.description}
              </div>
            )}
            {map.builtBy && (
              <div style={{ fontSize: '12px', marginTop: '6px', fontStyle: 'italic', color: '#666' }}>
                Built by {map.builtBy}
              </div>
            )}
          </button>
        ))}
        <button
          onClick={() => {
            audioManager.playUISound('cancel');
            onBack();
          }}
          style={{ ...mapButtonStyle, marginBottom: 0, backgroundColor: '#ccc' }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
