

# Advanced Mobile & Cross-Device Optimization with Smooth Performance

## Overview
Comprehensive optimization across all components to ensure the site looks and performs flawlessly on mobile, tablet, and desktop devices. The focus is on reducing 3D complexity on mobile for smooth 60fps scrolling, fixing layout issues, and adding touch-friendly interactions.

---

## 1. Create a Performance-Aware Mobile Hook

Create a new hook `useDevicePerformance` that detects mobile/tablet and reduces 3D rendering load accordingly:
- Detect device type via screen width and `navigator.hardwareConcurrency`
- Export `isMobile`, `isTablet`, `dpr` (device pixel ratio cap), and `particleScale` (multiplier to reduce particle counts)

**File:** `src/hooks/useDevicePerformance.ts` (new)

---

## 2. Optimize All 3D Sections for Mobile

Each 3D component will receive mobile-aware adjustments:

### FloatingLogo3D
- Reduce canvas height from `h-[550px]` to `h-[350px]` on mobile
- Lower `OrbitParticles` count and `FloatingParticles3D` count on mobile
- Stack grid layout vertically on mobile (already `lg:grid-cols-2`, but reduce spacing)

### WaveGrid3D
- Reduce plane geometry segments from `120x120` to `50x50` on mobile
- Lower canvas height from `h-[450px]` to `h-[300px]` on mobile
- Reduce `RisingColumns` count and `GlowingOrbs` count on mobile
- Cap DPR at 1 on mobile

### DNA3D
- Reduce `helixCount` from 60 to 30 on mobile
- Lower canvas height to `h-[350px]` on mobile

### GlobeNetwork3D
- Reduce sphere geometry from `128x128` to `64x64` on mobile
- Lower canvas height to `h-[400px]` on mobile

### NebulaVortex3D
- Reduce `PARTICLE_COUNT` from 5000 to 2000 on mobile
- Reduce vortex particle count from 1000 to 400
- Lower canvas height from `h-[600px]` to `h-[400px]` on mobile
- Cap DPR at 1 on mobile

---

## 3. HeroSection Mobile Fixes

- Reduce glow orb sizes from `w-[600px]` to `w-[300px]` on mobile (use responsive classes)
- Reduce floating particles from 20 to 8 on mobile
- Make stat values responsive: `text-3xl` on mobile instead of `text-4xl md:text-5xl`
- Reduce hero padding: `pt-16` on mobile vs `pt-20`
- Ensure badge text wraps gracefully on small screens

---

## 4. ServicesSection Mobile Optimization

- Reduce GSAP `rotateY` entrance to `0` on mobile (avoids janky 3D transforms)
- Add `touch-manipulation` to service cards for faster tap response
- Disable 3D tilt effect (`handleMouseMove`) on mobile/touch devices

---

## 5. ProcessSection & TestimonialsShowcase Mobile

- Ensure process connector lines are hidden on mobile (already `hidden lg:block`)
- Reduce padding from `py-32` to `py-16 md:py-32` across all sections
- Make testimonial cards single column on small mobile (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

---

## 6. CTASection & ContactSection Mobile

- Reduce glass card padding from `p-12 md:p-20` (already responsive, verify)
- Ensure buttons are full-width on mobile
- Trust badges: `gap-4` on mobile instead of `gap-8`

---

## 7. Smooth Scrolling & Animation Performance

- Add `will-change: transform` to all GSAP-animated elements
- Use `gsap.matchMedia()` to disable parallax effects on mobile (saves GPU)
- Reduce or disable parallax orb animations on mobile
- Add CSS `scroll-behavior: smooth` (already present)
- Use `transform: translateZ(0)` on scroll containers for GPU compositing

---

## 8. Global Mobile Spacing & Typography

Update `src/index.css` or section components:
- All `py-32` sections become `py-16 md:py-24 lg:py-32`
- All `mb-20` headers become `mb-12 md:mb-20`
- All `gap-16` grids become `gap-8 md:gap-16`
- Section headings: ensure `text-3xl md:text-4xl lg:text-6xl` scaling

---

## 9. MarqueeSection Mobile

- Reduce marquee speed on mobile for smoother performance
- Make pills smaller: `px-4 py-2 text-xs` on mobile

---

## 10. Footer Mobile

- Stack footer grid properly on small screens (already `md:grid-cols-2 lg:grid-cols-5`)
- Reduce link column grid to `grid-cols-2` on mobile with the third column below

---

## Technical Approach

- Use the existing `useIsMobile` hook plus a new `useDevicePerformance` hook
- Apply `gsap.matchMedia()` for conditional animations
- Use Tailwind responsive classes for layout/spacing changes
- Pass mobile-aware props to 3D components for reduced geometry/particle counts
- All changes maintain existing design language and brand aesthetics

---

## Files to Create
1. `src/hooks/useDevicePerformance.ts`

## Files to Modify
1. `src/components/HeroSection.tsx` - mobile spacing, reduced particles
2. `src/components/ServicesSection.tsx` - disable tilt on touch, reduce animations
3. `src/components/ProcessSection.tsx` - responsive padding
4. `src/components/TestimonialsShowcase.tsx` - responsive grid/padding
5. `src/components/CTASection.tsx` - responsive padding
6. `src/components/ContactSection.tsx` - responsive padding/gaps
7. `src/components/MarqueeSection.tsx` - mobile speed optimization
8. `src/components/GNexusSection.tsx` - responsive padding
9. `src/components/TeamSection.tsx` - responsive padding
10. `src/components/Footer.tsx` - mobile grid fix
11. `src/components/3d/FloatingLogo3D.tsx` - mobile 3D optimization
12. `src/components/3d/WaveGrid3D.tsx` - reduced geometry on mobile
13. `src/components/3d/DNA3D.tsx` - reduced helix count
14. `src/components/3d/GlobeNetwork3D.tsx` - reduced sphere detail
15. `src/components/3d/NebulaVortex3D.tsx` - reduced particles on mobile
16. `src/pages/Index.tsx` - no changes needed (layout already handled by children)

