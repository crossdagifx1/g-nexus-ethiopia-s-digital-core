import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WavePlane = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.PlaneGeometry>(null!);

  const { width, height } = useMemo(() => ({ width: 40, height: 40 }), []);

  useFrame((state) => {
    const geo = geometryRef.current;
    if (!geo) return;
    const pos = geo.attributes.position;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.4 + time) * 0.5 +
                Math.sin(y * 0.3 + time * 0.8) * 0.5 +
                Math.cos(x * 0.2 + y * 0.2 + time * 0.5) * 0.3;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry ref={geometryRef} args={[width, height, 80, 80]} />
      <meshStandardMaterial
        color="#c9922a"
        wireframe
        transparent
        opacity={0.3}
        emissive="#c9922a"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const GlowingOrbs = () => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const orbs = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        Math.sin(i * Math.PI / 4) * 5,
        Math.cos(i * Math.PI / 4) * 2 + 1,
        Math.sin(i * Math.PI / 3) * 3,
      ] as [number, number, number],
      color: i % 2 === 0 ? '#c9922a' : '#00d4ff',
      scale: 0.08 + Math.random() * 0.12,
    })),
  []);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
};

export const WaveGrid3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
      <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-6">
          ◈ Digital Landscape
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
          Riding the <span className="text-gradient-cyber">Digital Wave</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We navigate the ever-changing technology landscape to deliver solutions that 
          stay ahead of the curve. Our expertise spans across web, mobile, AI, and 3D ecosystems.
        </p>
      </div>
      <div className="relative h-[400px] rounded-3xl overflow-hidden max-w-6xl mx-auto">
        <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} color="#c9922a" />
          <pointLight position={[-5, 3, -5]} intensity={0.6} color="#00d4ff" />
          <WavePlane />
          <GlowingOrbs />
          <fog attach="fog" args={['#0f0d0a', 8, 25]} />
        </Canvas>
      </div>
      {/* Feature cards below */}
      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mt-16">
        {[
          { title: 'Adaptive Systems', desc: 'AI-driven solutions that learn and evolve with your business needs', icon: '🧠' },
          { title: 'Scalable Architecture', desc: 'Built to grow from startup to enterprise without breaking a sweat', icon: '🏗️' },
          { title: 'Real-time Analytics', desc: 'Instant insights powered by live data streams and smart dashboards', icon: '📊' },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl glass border-glow group hover:scale-105 transition-all duration-500">
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-display font-bold text-foreground mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
