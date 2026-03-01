

# Replace Globe Section with Neural Network 3D Visualization

## What's Changing
Remove the liquid globe 3D section (which is just a blobby sphere with no clear meaning) and replace it with a **Neural Network Brain** -- an interactive 3D visualization of interconnected nodes forming a brain-like neural network, representing G-Nexus's AI and intelligence capabilities.

## Why This is More Meaningful
- The liquid globe was purely decorative with no real connection to the "Global Reach" theme
- A Neural Network Brain directly represents AI innovation, machine learning, and intelligent systems -- core to G-Nexus's brand
- Interactive glowing nodes with pulsing connections create a "living intelligence" feel

## The New 3D Section: "Neural Network Brain"

**Visual Description:**
- ~80 nodes (spheres) arranged in a brain-like cluster shape using procedural positioning
- Glowing connection lines between nearby nodes that pulse with energy
- Nodes glow gold/cyan and pulse at different rates, simulating neural activity
- Mouse interaction causes nearby nodes to brighten and connections to intensify
- Sparkles float around the structure

**Section Content:**
- Badge: "Neural Intelligence"
- Heading: "Powered by **Intelligent Design**"
- Subtext: "Every project we build is infused with smart architecture, AI-driven workflows, and neural-level precision."
- Stats below: "AI Models Used", "Smart Automations", "Data Points Analyzed", "Neural Connections"

## Technical Approach

**File Changes:**
1. **Replace** `src/components/3d/GlobeNetwork3D.tsx` with the new Neural Network component
2. **No changes** needed to `Index.tsx` since it already imports from the same file path

**3D Implementation Details:**
- Use `THREE.BufferGeometry` with instanced rendering for nodes (performance-friendly)
- Connection lines via `THREE.LineSegments` between nodes within a distance threshold
- Custom shader for nodes: pulsing glow effect synced to time
- Mouse-reactive: nodes near pointer brighten
- Mobile optimization via `useDevicePerformance`: reduce node count (80 to 40), connection distance, and cap DPR

**Performance:**
- Desktop: ~80 nodes, ~200 connections, DPR up to 2
- Mobile: ~40 nodes, ~100 connections, DPR capped at 1
- All geometry is simple (small spheres + lines) -- much lighter than the old globe shader

