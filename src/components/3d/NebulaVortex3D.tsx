import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

// Swirling particle vortex
const ParticleVortex = () => {
  const points = useRef<THREE.Points>(null!);
  const count = 3000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const gold = new THREE.Color('#c9922a');
    const cyan = new THREE.Color('#00d4ff');
    const orange = new THREE.Color('#ff6b35');
    const palette = [gold, cyan, orange];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 12;
      const radius = 0.3 + (i / count) * 4;
      const height = (Math.random() - 0.5) * 3;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      siz[i] = Math.random() * 0.06 + 0.01;
    }
    return [pos, col, siz];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.15;
    const posAttr = points.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const angle = (i / count) * Math.PI * 12 + t * 0.3;
      const radius = 0.3 + (i / count) * 4;
      arr[idx] = Math.cos(angle) * radius;
      arr[idx + 2] = Math.sin(angle) * radius;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

// Central pulsing energy core with layered geometry
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
        {/* Outer fractured shell */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial
            color="#c9922a"
            emissive="#c9922a"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
        {/* Mid layer - glass-like */}
        <mesh ref={midRef}>
          <dodecahedronGeometry args={[1.1, 0]} />
          <meshPhysicalMaterial
            color="#c9922a"
            metalness={0.9}
            roughness={0.05}
            transmission={0.4}
            thickness={0.5}
            ior={2.2}
            transparent
            opacity={0.7}
            envMapIntensity={2}
          />
        </mesh>
        {/* Inner plasma core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={3}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Outermost cage */}
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[2.2, 0]} />
          <meshStandardMaterial
            color="#ff6b35"
            wireframe
            transparent
            opacity={0.06}
            emissive="#ff6b35"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Point lights from core */}
        <pointLight intensity={4} color="#c9922a" distance={6} />
        <pointLight intensity={2} color="#00d4ff" distance={4} />
      </group>
    </Float>
  );
};

// Particle text "GNEXUS"
const ParticleText = () => {
  const points = useRef<THREE.Points>(null!);
  const count = 2000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gold = new THREE.Color('#c9922a');
    const cyan = new THREE.Color('#00d4ff');

    // Create particles arranged to spell GNEXUS using mathematical positioning
    const letters = 'GNEXUS';
    const letterWidth = 1.2;
    const totalWidth = letters.length * letterWidth;
    const startX = -totalWidth / 2 + letterWidth / 2;

    for (let i = 0; i < count; i++) {
      const letterIdx = Math.floor(Math.random() * letters.length);
      const baseX = startX + letterIdx * letterWidth;
      // Distribute particles in letter-shaped regions
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.4;
      pos[i * 3] = baseX + Math.cos(angle) * r * 0.8;
      pos[i * 3 + 1] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      const t = Math.random();
      const c = t > 0.3 ? gold : cyan;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const arr = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 2 + i * 0.01) * 0.001;
      arr[i * 3 + 2] += Math.cos(t * 1.5 + i * 0.02) * 0.0005;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <points ref={points} position={[0, 0, 3]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
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
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <color attach="background" args={['#0d0b09']} />
              <fog attach="fog" args={['#0d0b09', 6, 18]} />
              <ambientLight intensity={0.15} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} color="#c9922a" />
              <pointLight position={[-5, -3, 5]} intensity={0.5} color="#00d4ff" />
              <MouseScene>
                <EnergyCore />
              </MouseScene>
              <ParticleText />
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
