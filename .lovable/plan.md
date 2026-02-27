

## Fix 3D Sections Not Rendering

The 3D sections (Crystal Showcase and Globe Network) are failing to render due to ref-forwarding errors. The `Trail` component from `@react-three/drei` tries to pass a `ref` to the `EnergyOrbit` component's child, but the way React Three Fiber handles this in v8 with React 18 causes warnings that can break rendering.

### Root Cause

The `Trail` component wraps `EnergyOrbit`'s mesh and attempts to clone it with a ref. This triggers React's "Function components cannot be given refs" warning repeatedly, which can cause the entire Canvas to fail silently.

### Fix Plan

**File: `src/components/3d/CrystalShowcase3D.tsx`**

1. Convert `EnergyOrbit` to use `React.forwardRef` so the `Trail` component can properly attach its ref.
2. Wrap the `EnergyOrbit` mesh child properly so Trail can clone it with a ref without errors.

**File: `src/components/3d/GlobeNetwork3D.tsx`**

3. Wrap the `Canvas` contents in a `Suspense` boundary with a fallback -- the `Text` component loads a font asynchronously and without Suspense, it can cause the entire scene to crash silently.
4. Add an `ErrorBoundary`-safe pattern so the globe renders even if the font fails to load.

### Technical Details

- `EnergyOrbit`: Refactor to `forwardRef` and ensure the inner `<mesh>` receives the forwarded ref properly
- Add `<Suspense fallback={null}>` around Canvas children in both files to handle async loading of `Environment` and `Text`
- This will eliminate all 4 console errors and allow both 3D sections to render

