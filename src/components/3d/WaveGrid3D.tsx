import { useRef, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles as DreiSparkles } from '@react-three/drei';
import { LazyCanvas } from './LazyCanvas';
import * as THREE from 'three';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

const WavePlane = ({ segments = 120 }: { segments?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.PlaneGeometry>(null!);
  const { pointer } = useThree();

  useFrame((state) => {
    const geo = geometryRef.current;
    if (!geo) return;
    const pos = geo.attributes.position;
    const time = state.clock.elapsedTime;
    const mx = pointer.x * 3;
    const my = pointer.y * 3;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distToMouse = Math.sqrt((x - mx * 10) ** 2 + (y - my * 10) ** 2);
      const mouseWave = Math.sin(distToMouse * 0.3 - time * 3) * Math.max(0, 1 - distToMouse * 0.05) * 1.5;
      const z = Math.sin(x * 0.4 + time * 0.8) * 0.6 +
                Math.sin(y * 0.3 + time * 0.6) * 0.6 +
                Math.cos(x * 0.15 + y * 0.15 + time * 0.4) * 0.4 +
                Math.sin(x * 0.8 + y * 0.5 + time * 1.2) * 0.2 +
                mouseWave;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry ref={geometryRef} args={[50, 50, segments, segments]} />
      <meshStandardMaterial color="#c9922a" wireframe transparent opacity={0.25} emissive="#c9922a" emissiveIntensity={0.3} />
    </mesh>
  );
};

const RisingColumns = ({ count = 30 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const columns = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 20 - 5,
      height: 0.5 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.6 ? '#00d4ff' : '#c9922a',
    })),
  [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const children = groupRef.current.children;
    columns.forEach((col, i) => {
      if (children[i]) {
        const scale = 0.5 + Math.sin(t * col.speed + col.phase) * 0.5;
        (children[i] as THREE.Mesh).scale.y = scale * col.height;
        (children[i] as THREE.Mesh).position.y = -2 + scale * col.height * 0.5;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {columns.map((col, i) => (
        <mesh key={i} position={[col.x, -2, col.z]}>
          <boxGeometry args={[0.15, 1, 0.15]} />
          <meshStandardMaterial color={col.color} emissive={col.color} emissiveIntensity={0.6} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const GlowingOrbs = ({ count = 15 }: { count?: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const orbs = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      position: [
        Math.sin(i * Math.PI / 7.5) * (3 + Math.random() * 4),
        Math.cos(i * Math.PI / 5) * 2 + 1 + Math.random(),
        Math.sin(i * Math.PI / 3) * 3 - 2,
      ] as [number, number, number],
      color: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#c9922a' : '#ff6b35',
      scale: 0.06 + Math.random() * 0.14,
      speed: 0.3 + Math.random() * 0.8,
      offset: Math.random() * Math.PI * 2,
    })),
  [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.08;
    const children = groupRef.current.children;
    orbs.forEach((orb, i) => {
      if (children[i]) {
        const mesh = children[i] as THREE.Mesh;
        mesh.position.y = orb.position[1] + Math.sin(t * orb.speed + orb.offset) * 0.8;
        const pulse = orb.scale * (1 + Math.sin(t * 2 + orb.offset) * 0.3);
        mesh.scale.setScalar(pulse / orb.scale);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshStandardMaterial color={orb.color} emissive={orb.color} emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  );
};

export const WaveGrid3D = () => {
  const { isMobile, dpr, particleScale } = useDevicePerformance();
  const segments = isMobile ? 50 : 120;
  const columnCount = Math.round(30 * particleScale);
  const orbCount = Math.round(15 * particleScale);

  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="relative z-10 max-w-7xl mx-auto text-center mb-10 md:mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-6">
          ◈ GNEXUS AI
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 md:mb-6">
          Powered by <span className="text-gradient-cyber">GNEXUS AI</span>
        </h2>
        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We navigate the ever-changing technology landscape to deliver solutions that 
          stay ahead of the curve. Move your mouse to interact with the digital terrain.
        </p>
      </div>
      <LazyCanvas className={`relative ${isMobile ? 'h-[300px]' : 'h-[450px]'} rounded-3xl overflow-hidden max-w-6xl mx-auto border border-border/20`} camera={{ position: [0, 6, 14], fov: 55 }} dpr={dpr}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.15} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} color="#c9922a" />
            <pointLight position={[-5, 5, -5]} intensity={0.6} color="#00d4ff" />
            <pointLight position={[5, 2, 5]} intensity={0.4} color="#ff6b35" />
            <WavePlane segments={segments} />
            <RisingColumns count={columnCount} />
            <GlowingOrbs count={orbCount} />
            <DreiSparkles count={isMobile ? 20 : 40} size={1.5} scale={15} color="#00d4ff" speed={0.3} />
            <fog attach="fog" args={['#0f0d0a', 10, 30]} />
          </Suspense>
      </LazyCanvas>
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-16">
        {[
          { title: 'Adaptive Systems', desc: 'AI-driven solutions that learn and evolve with your business needs', icon: '🧠' },
          { title: 'Scalable Architecture', desc: 'Built to grow from startup to enterprise without breaking a sweat', icon: '🏗️' },
          { title: 'Real-time Analytics', desc: 'Instant insights powered by live data streams and smart dashboards', icon: '📊' },
        ].map((item) => (
          <div key={item.title} className="p-5 md:p-6 rounded-2xl glass border-glow group hover:scale-105 transition-all duration-500">
            <div className="text-2xl md:text-3xl mb-3 md:mb-4">{item.icon}</div>
            <h3 className="text-base md:text-lg font-display font-bold text-foreground mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
