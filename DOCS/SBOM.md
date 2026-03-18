# Software Bill of Materials (SBOM)

> **Rule:** Update on every package install/remove. Audit packages before install.

---

## Runtime Dependencies

### Core Framework & 3D Engine
| Package | Version | Role | Security |
|---------|---------|------|----------|
| react | ^19.2.0 | Frontend library (Concurrent mode) | ✅ Clean |
| react-dom | ^19.2.0 | DOM renderer | ✅ Clean |
| three | ^0.183.2 | Core 3D/WebGL engine | ✅ Clean |
| @react-three/fiber | ^9.5.0 | R3F (Managed scene graph) | ✅ Clean |
| @react-three/drei | ^10.7.7 | Essential R3F utilities | ✅ Clean |

### Visuals, Post-Processing & Special Effects
| Package | Version | Role | Security |
|---------|---------|------|----------|
| @react-three/postprocessing | ^3.0.4 | Bloom, Vignette, Tactical VFX | ✅ Clean |
| leva | ^0.10.1 | Real-time scene tuning GUI | ✅ Clean |

### Motion, UI & UX
| Package | Version | Role | Security |
|---------|---------|------|----------|
| motion | ^12.35.2 | Framer Motion (High-perf DOM UI) | ✅ Clean |
| @react-three/cannon | ^6.6.0 | Physics engine (Web Workers) | ✅ Clean |

### State & Infrastructure
| Package | Version | Role | Security |
|---------|---------|------|----------|
| zustand | ^5.0.11 | Global state (Transient updates) | ✅ Clean |
| uuid | ^13.0.0 | Unique entity identification | ✅ Clean |

---

## Dev Dependencies (Tooling)

| Package | Version | Role | Security |
|---------|---------|------|----------|
| vite | ^7.3.1 | Build/Dev server | ✅ Clean |
| @vitejs/plugin-react | ^5.1.1 | React HMR support | ✅ Clean |
| typescript | ~5.9.3 | Static typing (Strict mode) | ✅ Clean |
| eslint | ^9.39.1 | Code quality | ✅ Clean |
| typescript-eslint | ^8.48.0 | TS linting rules | ✅ Clean |
| @types/* | (Various) | TypeScript definitions | ✅ Clean |

---

## Changelog

- **2026-03-10:** Upgraded SBOM to categorized structure. Added `motion`, `@react-three/postprocessing`, `@react-three/cannon`, and `leva` to runtime.
- **2026-03-10:** Initial SBOM structure with primary dependencies.
