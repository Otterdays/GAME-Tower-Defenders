import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const NarratorOverlay: React.FC = () => {
  const narratorMessage = useGameStore((state) => state.narratorMessage);
  const reducedMotion = useGameStore((state) => state.settings.reducedMotion);
  const [bounceClass, setBounceClass] = useState('');

  useEffect(() => {
    if (reducedMotion) return;
    setBounceClass('');
    const timeout = setTimeout(() => setBounceClass('narrator-talk'), 10);
    return () => clearTimeout(timeout);
  }, [narratorMessage, reducedMotion]);

  return (
    <div
      className={`panel-tactical ${reducedMotion ? '' : 'narrator-pop'}`}
      style={{
        position: 'absolute',
        bottom: '100px',
        left: '20px',
        width: '350px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
        zIndex: 5,
        borderLeft: '4px solid #00d2d3'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          className={reducedMotion ? '' : bounceClass}
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(0, 210, 211, 0.2)',
            border: '1px solid #00d2d3',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}>
          <div style={{ width: '15px', height: '15px', background: '#00d2d3', borderRadius: '50%', boxShadow: '0 0 10px #00d2d3' }} />
        </div>
        <div className="tactical-font" style={{ fontSize: '0.7rem', color: '#00d2d3', letterSpacing: '2px' }}>
          COMMS_LINK: ACTIVE
        </div>
      </div>
      
      <div style={{
        fontSize: '0.9rem',
        color: '#e0e0e0',
        lineHeight: 1.5,
        borderTop: '1px solid rgba(0, 210, 211, 0.1)',
        paddingTop: '10px',
        fontStyle: 'italic',
        opacity: 0.9
      }}>
        "{narratorMessage}"
      </div>
      
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ width: '15px', height: '2px', background: '#00d2d3', opacity: Math.random() }} />
        ))}
      </div>
    </div>
  );
};
