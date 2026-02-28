

# Stunning Particle Text Overhaul for GNEXUS

## What We're Building
A completely redesigned particle text system that makes "GNEXUS" the star of the Nebula Vortex section -- with thousands of dense, glowing particles tightly forming bold letterforms, plus animated transformation effects where particles morph between multiple text phrases.

## Key Improvements

### 1. Bold, Dense Particle Letters
- Increase particle count to **5,000** for much denser, more readable text
- Use **filled letter shapes** (not just strokes) -- particles fill the entire body of each letter using grid sampling with inside-polygon checks
- Larger letter scale (2x current size) so the text dominates the scene
- Vary particle sizes for depth (smaller particles at edges, larger in center)

### 2. Multi-Text Morphing Animation
- Particles cycle through multiple texts: **"GNEXUS"** -> **"CREATE"** -> **"INNOVATE"** -> **"BUILD"** (loop)
- Smooth particle transition: each particle lerps from its current position to the next text's position over ~2 seconds, with staggered timing for a wave effect
- 4-second hold on each word before morphing to the next

### 3. Enhanced Visual Quality
- **Glow layers**: Two overlapping point clouds -- a sharp small-particle layer and a larger soft-glow layer underneath
- **Color breathing**: Colors subtly shift over time (gold -> warm white -> cyan pulse)
- Particles at letter edges emit a faint sparkle/twinkle effect via opacity oscillation
- Remove the background ParticleVortex to let the text be the focal point (or significantly reduce its opacity)

### 4. Mouse Interaction
- Include the ParticleText inside the MouseScene so the text reacts to mouse movement with a parallax tilt

---

## Technical Plan

### File: `src/components/3d/NebulaVortex3D.tsx`

**New helper -- `getLetterFilledPoints`**:
- Define each letter (G, N, E, X, U, S, C, R, A, T, I, O, V, B, L, D) as a set of polygon outlines
- Sample points on a grid within each letter's bounding box, keeping only those inside the polygon
- Return normalized point positions for any arbitrary word

**Rewritten `ParticleText` component**:
- Store target positions for each word in `useMemo`
- Use `useRef` for a morph progress value and current/next word indices
- In `useFrame`: lerp particle positions between current word and next word targets, with per-particle stagger
- Two `<points>` layers: crisp particles (size 0.04) + glow particles (size 0.12, lower opacity)
- Animate color attributes to pulse between gold/white/cyan

**Scene adjustments**:
- Move `ParticleText` inside `MouseScene` for mouse reactivity
- Reduce `ParticleVortex` count to 1000 and lower opacity to 0.3 so text stands out
- Adjust camera position slightly closer (z: 6) and increase FOV to 55 for better text framing

