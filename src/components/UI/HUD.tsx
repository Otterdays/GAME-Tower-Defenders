import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/gameStore';
import type { TargetMode, GatlingUpgrade, MortarUpgrade } from '../../store/gameStore';

const TARGET_MODES: { value: TargetMode; label: string }[] = [
  { value: 'nearest', label: 'Nearest' },
  { value: 'closestToGoal', label: 'To goal' },
  { value: 'highestHp', label: 'High HP' },
  { value: 'lowestHp', label: 'Low HP' },
  { value: 'fastest', label: 'Fastest' },
];

export const HUD: React.FC = () => {
  const {
    gold,
    health,
    wave,
    runState,
    enemies,
    enemiesToSpawnThisWave,
    selectedTowerType,
    setSelectedTowerType,
    selectedTargetMode,
    setSelectedTargetMode,
    selectedGatlingUpgrade,
    setSelectedGatlingUpgrade,
    selectedMortarUpgrade,
    setSelectedMortarUpgrade,
    pauseGame,
  } = useGameStore();

  const canPause = runState === 'WAVE' || runState === 'PRE_WAVE';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute',
        inset: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        pointerEvents: 'none',
        zIndex: 10,
    }}>
      {/* Top Bar: Stats & Meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ display: 'flex', gap: '15px' }}
        >
          <div className="panel-tactical" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="glow-cyan" style={{ fontSize: '1.2rem', color: '#ff4d4d' }}>❤</span>
            <span className="tactical-font" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{health}</span>
          </div>
          <div className="panel-tactical" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="glow-cyan" style={{ fontSize: '1.2rem', color: '#ffd700' }}>◈</span>
            <span className="tactical-font" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ffd700' }}>{gold}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}
        >
          <div className="panel-tactical" style={{ padding: '10px 20px', textAlign: 'right' }}>
            <div className="tactical-font" style={{ fontSize: '0.7rem', opacity: 0.6 }}>Mission Wave</div>
            <div className="tactical-font" style={{ fontSize: '1.8rem', color: '#00d2d3' }}>{wave === 0 ? 1 : wave}</div>
          </div>
          {runState === 'WAVE' && (
            <div className="panel-tactical" style={{ padding: '8px 15px', display: 'flex', gap: '10px', fontSize: '0.8rem' }}>
              <span className="tactical-font" style={{ opacity: 0.7 }}>Targets:</span>
              <span className="tactical-font text-cyan">{enemies.length} / {enemiesToSpawnThisWave}</span>
            </div>
          )}
          {canPause && (
            <button
              onClick={pauseGame}
              className="btn-tactical"
              style={{ pointerEvents: 'auto', marginTop: '5px' }}
            >
              PAUSE_CMD
            </button>
          )}
        </motion.div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom Interface: Deployment & Targeting */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        {/* Target Mode Selector */}
        <div className="panel-tactical" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto', width: 'fit-content', alignSelf: 'center' }}>
          <span className="tactical-font" style={{ fontSize: '0.7rem', padding: '0 10px', opacity: 0.8 }}>Targeting Protocol:</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            {TARGET_MODES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedTargetMode(value)}
                className={`btn-tactical ${selectedTargetMode === value ? 'active' : ''}`}
                style={{ padding: '5px 12px', fontSize: '0.65rem', clipPath: 'none' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tower Deployment Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', pointerEvents: 'auto' }}>
          <div className="panel-tactical" style={{ padding: '15px', display: 'flex', gap: '15px' }}>
            <button
              onClick={() => setSelectedTowerType('Gatling')}
              className={`btn-tactical ${selectedTowerType === 'Gatling' ? 'active' : ''}`}
              style={{ width: '160px', textAlign: 'left', padding: '12px' }}
            >
              <div className="tactical-font">Gatling</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '4px' }}>Cost: 20◈ | Rapid Fire</div>
            </button>

            <button
              onClick={() => setSelectedTowerType('Mortar')}
              className={`btn-tactical ${selectedTowerType === 'Mortar' ? 'active' : ''}`}
              style={{ width: '160px', textAlign: 'left', padding: '12px' }}
            >
              <div className="tactical-font">Mortar</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: '4px' }}>Cost: 40◈ | Area Effect</div>
            </button>
          </div>

          {/* Dynamic Upgrade Panel */}
          <AnimatePresence mode="wait">
            {selectedTowerType === 'Gatling' && (
              <motion.div 
                key="up-gatling"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="panel-tactical" 
                style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <div className="tactical-font" style={{ fontSize: '0.6rem', opacity: 0.7 }}>Sys-Upgrades:</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {(['default', 'rapid', 'pierce'] as GatlingUpgrade[]).map((up) => (
                    <button
                      key={up}
                      onClick={() => setSelectedGatlingUpgrade(up)}
                      className={`btn-tactical ${selectedGatlingUpgrade === up ? 'active' : ''}`}
                      style={{ padding: '6px 15px', fontSize: '0.7rem' }}
                    >
                      {up.toUpperCase()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {selectedTowerType === 'Mortar' && (
              <motion.div 
                key="up-mortar"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="panel-tactical" 
                style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <div className="tactical-font" style={{ fontSize: '0.6rem', opacity: 0.7 }}>Sys-Upgrades:</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {(['default', 'bigBoom', 'shrapnel'] as MortarUpgrade[]).map((up) => (
                    <button
                      key={up}
                      onClick={() => setSelectedMortarUpgrade(up)}
                      className={`btn-tactical ${selectedMortarUpgrade === up ? 'active' : ''}`}
                      style={{ padding: '6px 15px', fontSize: '0.7rem' }}
                    >
                      {up.toUpperCase()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
