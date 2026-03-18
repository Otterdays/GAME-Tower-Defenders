import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';
import { GalleryUnit } from '../Gallery/GalleryUnit';
import type { EnemyType, TowerType } from '../../store/gameStore';

const TOWERS: { type: TowerType; name: string; desc: string }[] = [
  { type: 'Gatling', name: 'Gatling Pylon', desc: 'High-speed kinetic energy dispenser. Effective against standard and runner units.' },
  { type: 'Mortar', name: 'Mortar Battery', desc: 'Heavy explosive ordinance. Deals massive AoE damage but has a slow fire rate.' },
];

const ENEMIES: { type: EnemyType; name: string; desc: string }[] = [
  { type: 'Standard', name: 'Recon Drone', desc: 'Low-threat scouting unit. Agile but fragile.' },
  { type: 'Runner', name: 'Interdictor', desc: 'High-speed interceptor. Prioritizes speed over durability to break through lines.' },
  { type: 'Flying', name: 'Air-Stalker', desc: 'Anti-gravity unit. Bypasses terrain obstacles but vulnerable to rapid fire.' },
  { type: 'Tank', name: 'Heavy Siege Unit', desc: 'Arid-environment behemoth. Heavily armored and slow moving.' },
  { type: 'Swarm', name: 'Fragmenter', desc: 'Small, geometric anomalies. Difficult to target due to their size.' },
  { type: 'Brute', name: 'Shock Trooper', desc: 'High-durability vanguard unit designed to absorb turret fire.' },
];

export const GalleryOverlay: React.FC = () => {
  const { closeGallery } = useGameStore();
  const [selectedUnit, setSelectedUnit] = useState<{ type: EnemyType | TowerType; category: 'enemy' | 'tower'; name: string; desc: string }>(
    { ...TOWERS[0], category: 'tower' }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-fullscreen"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 15, 0.98)',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) 3fr',
        gap: '20px',
        padding: '40px',
        zIndex: 1000,
        backdropFilter: 'blur(15px)',
      }}
    >
      {/* Sidebar: List of units */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto', paddingRight: '10px' }}>
        <h2 className="tactical-font" style={{ color: '#00d2d3', borderBottom: '2px solid rgba(0,210,211,0.3)', paddingBottom: '15px', letterSpacing: '2px' }}>
          INTEL REPOSITORY
        </h2>
        
        <div className="gallery-section">
          <h3 className="tactical-font" style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '15px', color: '#00d2d3' }}>[ DEFENSE SYSTEMS ]</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TOWERS.map((t) => (
              <button
                key={t.type}
                onClick={() => setSelectedUnit({ ...t, category: 'tower' })}
                className={`btn-tactical ${selectedUnit.type === t.type ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.9rem' }}
              >
                {t.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-section">
          <h3 className="tactical-font" style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '15px', color: '#ff7675' }}>[ IDENTIFIED THREATS ]</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ENEMIES.map((e) => (
              <button
                key={e.type}
                onClick={() => setSelectedUnit({ ...e, category: 'enemy' })}
                className={`btn-tactical ${selectedUnit.type === e.type ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.9rem' }}
              >
                {e.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={closeGallery} 
          className="btn-tactical" 
          style={{ marginTop: 'auto', background: 'rgba(255, 118, 117, 0.1)', borderColor: '#ff7675', color: '#ff7675' }}
        >
          CLOSE ARCHIVE
        </button>
      </div>

      {/* Main Content: 3D View and Info */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid rgba(0,210,211,0.1)' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Canvas shadows camera={{ position: [3, 3, 3], fov: 40 }}>
            <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} makeDefault />
            <Environment preset="city" />
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={2} castShadow />
            
            <Suspense fallback={null}>
               <Stage environment="city" intensity={0.5} adjustCamera={true}>
                  <GalleryUnit key={selectedUnit.type} type={selectedUnit.type} category={selectedUnit.category} />
               </Stage>
            </Suspense>
          </Canvas>
          
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', pointerEvents: 'none' }}>
            <motion.div
              key={selectedUnit.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="tactical-font" style={{ margin: 0, color: '#00d2d3', fontSize: '3rem', textShadow: '0 0 20px rgba(0,210,211,0.3)' }}>
                {selectedUnit.name.toUpperCase()}
              </h1>
              <div style={{ height: '2px', width: '100px', background: '#00d2d3', margin: '15px 0' }} />
              <p className="tactical-font" style={{ margin: 0, opacity: 0.8, maxWidth: '600px', fontSize: '1.1rem', lineHeight: '1.6', letterSpacing: '1px' }}>
                {selectedUnit.desc}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
