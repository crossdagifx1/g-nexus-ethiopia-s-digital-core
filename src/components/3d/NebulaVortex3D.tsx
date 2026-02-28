import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

// ── Canvas-based text to particle positions ──
// Renders text on an offscreen 2D canvas, samples filled pixels for particle positions.
const textCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;

const getWordPoints = (word: string, targetCount: number, scaleW: number, scaleH: number): Float32Array => {
  const result = new Float32Array(targetCount * 3);
  if (!textCanvas) return result;

  const ctx = textCanvas.getContext('2d')!;
  const canvasW = 512;
  const canvasH = 128;
  textCanvas.width = canvasW;
  textCanvas.height = canvasH;

  // Clear and draw text
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Use bold font, adjust size based on word length
  const fontSize = word.length <= 5 ? 100 : word.length <= 6 ? 88 : 72;
  ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.fillText(word, canvasW / 2, canvasH / 2);

  // Read pixel data
  const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
  const pixels = imageData.data;

  // Collect all filled pixel positions
  const filledPoints: number[] = [];
  for (let y = 0; y < canvasH; y += 1) {
    for (let x = 0; x < canvasW; x += 1) {
      const alpha = pixels[(y * canvasW + x) * 4 + 3];
      if (alpha > 128) {
        // Normalize to centered coordinates
        const nx = (x / canvasW - 0.5) * scaleW;
        const ny = -(y / canvasH - 0.5) * scaleH; // flip Y for 3D
        filledPoints.push(nx, ny);
      }
    }
  }

  // Distribute particles across filled pixels
  const pointCount = filledPoints.length / 2;
  if (pointCount === 0) return result;

  for (let i = 0; i < targetCount; i++) {
    const si = Math.floor(Math.random() * pointCount);
    result[i * 3] = filledPoints[si * 2] + (Math.random() - 0.5) * 0.02;
    result[i * 3 + 1] = filledPoints[si * 2 + 1] + (Math.random() - 0.5) * 0.02;
    result[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
  }
  return result;
};

// ── Reduced particle vortex (background) ──
const ParticleVortex = () => {
  const points = useRef<THREE.Points>(null!);
  const count = 1000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gold = new THREE.Color('#c9922a');
    const cyan = new THREE.Color('#00d4ff');
    const palette = [gold, cyan];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 12;
      const radius = 0.5 + (i / count) * 5;
      const height = (Math.random() - 0.5) * 3;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

// ── Energy Core (unchanged) ──
const EnergyCore = () => {
  const outerRef = useRef<THREE.Mesh>(null!);
  const midRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const shellRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2) * 0.08;
    outerRef.current.scale.setScalar(pulse);
    outerRef.current.rotation.y = t * 0.2;
    outerRef.current.rotation.x = Math.sin(t * 0.15) * 0.3;
    midRef.current.rotation.y = -t * 0.4;
    midRef.current.rotation.z = t * 0.25;
    midRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
    innerRef.current.rotation.x = t * 0.6;
    innerRef.current.rotation.z = -t * 0.3;
    shellRef.current.rotation.y = t * 0.08;
    shellRef.current.rotation.x = t * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group>
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial color="#c9922a" emissive="#c9922a" emissiveIntensity={0.4} wireframe transparent opacity={0.15} />
        </mesh>
        <mesh ref={midRef}>
          <dodecahedronGeometry args={[1.1, 0]} />
          <meshPhysicalMaterial color="#c9922a" metalness={0.9} roughness={0.05} transmission={0.4} thickness={0.5} ior={2.2} transparent opacity={0.7} envMapIntensity={2} />
        </mesh>
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} transparent opacity={0.9} />
        </mesh>
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[2.2, 0]} />
          <meshStandardMaterial color="#ff6b35" wireframe transparent opacity={0.06} emissive="#ff6b35" emissiveIntensity={0.2} />
        </mesh>
        <pointLight intensity={4} color="#c9922a" distance={6} />
        <pointLight intensity={2} color="#00d4ff" distance={4} />
      </group>
    </Float>
  );
};

// ── Morphing Particle Text ──
const WORDS = ['GNEXUS', 'CREATE', 'INNOVATE', 'BUILD'];
const PARTICLE_COUNT = 5000;
const TEXT_SCALE_W = 6;
const TEXT_SCALE_H = 1.5;
const HOLD_TIME = 4;
const MORPH_TIME = 2;

const MorphingParticleText = () => {
  const sharpRef = useRef<THREE.Points>(null!);
  const glowRef = useRef<THREE.Points>(null!);
  const colRef = useRef<THREE.BufferAttribute>(null!);
  const colRef2 = useRef<THREE.BufferAttribute>(null!);

  const wordTargets = useMemo(() => {
    return WORDS.map(w => getWordPoints(w, PARTICLE_COUNT, TEXT_SCALE_W, TEXT_SCALE_H));
  }, []);

  const currentPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const colors = useMemo(() => {
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const gold = new THREE.Color('#c9922a');
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      col[i * 3] = gold.r; col[i * 3 + 1] = gold.g; col[i * 3 + 2] = gold.b;
    }
    return col;
  }, []);

  // Initialize positions to first word
  useMemo(() => {
    currentPositions.set(wordTargets[0]);
  }, [wordTargets, currentPositions]);

  const stateRef = useRef({ wordIdx: 0, timer: 0, morphing: false, morphProgress: 0 });

  useFrame((state, delta) => {
    const s = stateRef.current;
    s.timer += delta;

    if (!s.morphing) {
      // Holding
      if (s.timer >= HOLD_TIME) {
        s.morphing = true;
        s.timer = 0;
        s.morphProgress = 0;
      }
    } else {
      // Morphing
      s.morphProgress = Math.min(s.timer / MORPH_TIME, 1);
      const nextIdx = (s.wordIdx + 1) % WORDS.length;
      const from = wordTargets[s.wordIdx];
      const to = wordTargets[nextIdx];
      const arr = sharpRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Staggered easing per particle
        const stagger = (i / PARTICLE_COUNT) * 0.3;
        const t = Math.max(0, Math.min(1, (s.morphProgress - stagger) / (1 - 0.3)));
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
        const idx = i * 3;
        arr[idx] = from[idx] + (to[idx] - from[idx]) * ease;
        arr[idx + 1] = from[idx + 1] + (to[idx + 1] - from[idx + 1]) * ease;
        arr[idx + 2] = from[idx + 2] + (to[idx + 2] - from[idx + 2]) * ease;
      }
      sharpRef.current.geometry.attributes.position.needsUpdate = true;

      // Sync glow layer
      const glowArr = glowRef.current.geometry.attributes.position.array as Float32Array;
      glowArr.set(arr);
      glowRef.current.geometry.attributes.position.needsUpdate = true;

      if (s.morphProgress >= 1) {
        s.wordIdx = nextIdx;
        s.morphing = false;
        s.timer = 0;
      }
    }

    // Idle shimmer when holding
    if (!s.morphing) {
      const t = state.clock.elapsedTime;
      const base = wordTargets[s.wordIdx];
      const arr = sharpRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        arr[idx] = base[idx] + Math.sin(t * 1.5 + i * 0.008) * 0.012;
        arr[idx + 1] = base[idx + 1] + Math.sin(t * 2.2 + i * 0.006) * 0.015;
        arr[idx + 2] = base[idx + 2] + Math.cos(t * 1.8 + i * 0.01) * 0.008;
      }
      sharpRef.current.geometry.attributes.position.needsUpdate = true;
      const glowArr = glowRef.current.geometry.attributes.position.array as Float32Array;
      glowArr.set(arr);
      glowRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Color breathing
    const ct = state.clock.elapsedTime;
    const gold = new THREE.Color('#c9922a');
    const white = new THREE.Color('#ffe8b0');
    const cyan = new THREE.Color('#00d4ff');
    const breathe = (Math.sin(ct * 0.5) + 1) / 2; // 0..1
    const baseColor = new THREE.Color().lerpColors(gold, white, breathe * 0.5);
    const colArr = colRef.current.array as Float32Array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const sparkle = Math.sin(ct * 3 + i * 0.1) > 0.95 ? 1 : 0;
      const c = sparkle ? cyan : baseColor;
      colArr[i * 3] = c.r; colArr[i * 3 + 1] = c.g; colArr[i * 3 + 2] = c.b;
    }
    colRef.current.needsUpdate = true;
    // Glow layer gets same colors
    const colArr2 = colRef2.current.array as Float32Array;
    colArr2.set(colArr);
    colRef2.current.needsUpdate = true;
  });

  const initPos = useMemo(() => new Float32Array(wordTargets[0]), [wordTargets]);
  const initCol = useMemo(() => new Float32Array(colors), [colors]);
  const initCol2 = useMemo(() => new Float32Array(colors), [colors]);

  return (
    <group position={[0, 0, 3]}>
      {/* Glow layer (behind) */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={initPos} itemSize={3} />
          <bufferAttribute ref={colRef2} attach="attributes-color" count={PARTICLE_COUNT} array={initCol2} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.2} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      {/* Sharp layer (front) */}
      <points ref={sharpRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={new Float32Array(initPos)} itemSize={3} />
          <bufferAttribute ref={colRef} attach="attributes-color" count={PARTICLE_COUNT} array={initCol} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.025} vertexColors transparent opacity={0.95} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
};

// Mouse-reactive scene wrapper
const MouseScene = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  useFrame(() => {
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.5, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.3, 0.04);
  });

  return <group ref={group}>{children}</group>;
};

export const NebulaVortex3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
            🌌 The Nexus Core
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            Energy of <span className="text-gradient-gold text-glow-gold">Creation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            At the heart of every project lies a vortex of creativity, technology, and ambition — 
            spiraling together to forge digital experiences that transcend the ordinary.
          </p>
        </div>
        <div className="h-[600px] rounded-3xl overflow-hidden border border-border/20 mx-auto max-w-4xl">
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <color attach="background" args={['#0d0b09']} />
              <fog attach="fog" args={['#0d0b09', 6, 18]} />
              <ambientLight intensity={0.15} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} color="#c9922a" />
              <pointLight position={[-5, -3, 5]} intensity={0.5} color="#00d4ff" />
              <MouseScene>
                <EnergyCore />
                <MorphingParticleText />
              </MouseScene>
              <ParticleVortex />
              <DreiSparkles count={100} size={2.5} scale={10} color="#c9922a" speed={0.3} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          {[
            { value: '∞', label: 'Creative Potential' },
            { value: '10x', label: 'Faster Delivery' },
            { value: '360°', label: 'Full-Stack Vision' },
            { value: '100%', label: 'Passion Driven' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl glass border-glow text-center hover:scale-105 transition-transform duration-300">
              <div className="text-2xl font-display font-bold text-gold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
