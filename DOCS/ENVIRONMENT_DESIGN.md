# Environment Design

> **Source of truth:** `src/constants/environment.ts`  
> **Last updated:** March 10, 2026

Single source for atmosphere, materials, timing, and environmental constants. All scene visuals and VFX timings should reference this module so tuning is centralized and documented.

---

## Design Pillars

1. **Tactical dusk** — Dark blue-grey background, cyan accent, low saturation. Readable and focused.
2. **Clear affordances** — Start = blue, End = red; valid = cyan, invalid = red. No ambiguity.
3. **Procedural-first** — No external texture/model assets; colors and geometry from constants.
4. **One place to tune** — Change `environment.ts` and docs; components import, not hardcode.

---

## Palette (`ENV_PALETTE`)

| Token       | Hex        | Use |
|------------|------------|-----|
| background | `#0d0d12`  | Canvas, fog, sky (match fog for seamless edge) |
| text       | `#e0e0e0`  | UI body |
| accent     | `#00d2d3`  | Path, buttons, valid hologram, path preview |
| danger     | `#ff7675`  | Invalid hologram, alerts |
| startBase  | `#341f97`  | Start pylon base |
| startGlow  | `#54a0ff`  | Start spire + point light |
| endBase    | `#b33939`  | End pylon base |
| endGlow    | `#ff5252`  | End spire + point light |
| ground     | `#2d3436`  | Ground plane |
| gridPrimary   | `#1e272e` | Grid lines (darker) |
| gridSecondary | `#485460` | Grid lines (lighter) |
| obstacle   | `#4a4a4a`  | Ruins / static obstacles |
| pathPreview| `#00d2d3`  | Path preview tiles (same as accent) |

---

## Lighting (`ENV_LIGHTING`)

- **Ambient:** `intensity 0.4` — fill without washing out shadows.
- **Directional:** `[10, 20, 10]`, intensity `1.2`, shadow map `2048` — main sun, casts shadows.
- **Start pylon:** point light, cyan, intensity `0.5`, distance `3`.
- **End pylon:** point light, red, intensity `0.5`, distance `3`.

Future: time-of-day could scale intensity and tint directional color via `lerpColorHex`.

---

## Fog (`ENV_FOG`)

- **Color:** same as background for seamless blend.
- **Near / Far:** `15` / `30` — hide distant edge of grid without clipping mid-field.

Use `getFogArgs()` for `<fog attach="fog" args={getFogArgs()} />`.

---

## Post-processing (`ENV_POST`)

- **Bloom:** luminanceThreshold `0.5`, mipmapBlur, intensity `1.5`, radius `0.4` — emissive elements (pylons, path) glow.
- **Vignette:** offset `0.1`, darkness `0.8`, eskil `false` — focus view toward center.

---

## Ground & Grid (`ENV_GROUND`, `ENV_OBSTACLES`)

- **Ground plane:** color, roughness, metalness, Y offset.
- **Grid helper:** two line colors, Y offset below plane.
- **Obstacles:** box size, Y, material (color, roughness, metalness).

Obstacles read as “ruins” — neutral grey, no glow.

---

## Pylons (`ENV_PYLONS`)

Start and end each have:
- **Base:** cylinder (radiusTop, radiusBottom, height, segments).
- **Spire:** emissive cylinder + point light.

Start = blue family; End = red family. Keeps wayfinding instant.

---

## Hologram & Path Preview (`ENV_HOLOGRAM`, `ENV_PATH_PREVIEW`)

- Valid/invalid colors, opacity, base box size for placement preview.
- Path preview: small flat boxes, emissive tint, opacity.

---

## VFX Timing (`ENV_VFX`)

| Constant               | Value | Use |
|------------------------|-------|-----|
| particleLifetime       | 0.5 s | Death particles |
| floatingTextLifetime  | 1.0 s | Gold/damage float text |
| floatingTextRiseSpeed | 1.5   | Units per second |
| hitFlashDuration      | 0.15 s| Enemy hit flash |

---

## Scripts / Helpers

- **`lerpColorHex(hexA, hexB, t)`** — Lerp between two hex colors; `t` in [0,1]. Use for time-of-day or damage pulse.
- **`getFogArgs()`** — Returns `[color, near, far]` for Three.js fog.

---

## Asset Manifest (Procedural / Future)

No external assets are required for the current environment. Everything is driven by:

- **Geometry:** Three.js primitives (plane, box, cylinder, sphere) and sizes from constants.
- **Materials:** `meshStandardMaterial` with colors/roughness/metalness/emissive from `ENV_*`.
- **Fonts:** UI uses Google Fonts (Inter, Orbitron) via `index.css`.

**Future asset hooks (document only):**

| Asset type   | Status   | Note |
|-------------|----------|------|
| Skybox      | Optional | Could replace solid background; use ENV_PALETTE.background as fallback. |
| Ground tex  | Optional | Tiling diffuse/normal; keep ENV_GROUND.color as default. |
| Obstacle meshes | Optional | Per-map; keep box + ENV_OBSTACLES as default. |
| SFX         | In use   | audioManager; not in environment.ts. |
| Music       | Future   | Could add ENV_AUDIO.musicVolume, track list. |

---

## Usage

```ts
import {
  ENV_PALETTE,
  ENV_LIGHTING,
  ENV_FOG,
  getFogArgs,
  ENV_VFX,
} from '../constants/environment';
```

Wire `GameScene`, `Grid`, and VFX components to these constants so all env tuning lives in one module and this doc stays accurate.

---

## Extension Points

- **Biomes (future):** New constant sets (e.g. `ENV_BIOME_FOREST`) with different palette, fog, and ground; map or mode selects biome.
- **Time of day:** `envTime` in [0,1] → lerp directional color and intensity; optional fog near/far.
- **Weather:** Tint fog and ambient; optional particle layer (rain/snow) with own constants.
