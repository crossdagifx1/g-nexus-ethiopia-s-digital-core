import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Environment } from '@react-three/drei';
import * as THREE from 'three';

const GoldSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.8, 4]} />
        <MeshDistortMaterial
          color="#c9922a"
          metalness={0.9}
          roughness={0.1}
          distort={0.25}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
};

const OrbitRings = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    group.current.rotation.z = state.clock.elapsedTime * 0.15;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
  });

  return (
    <group ref={group}>
      {[2.5, 3.2, 3.9].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={i === 1 ? '#00d4ff' : '#c9922a'}
            emissive={i === 1 ? '#00d4ff' : '#c9922a'}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

const FloatingParticles3D = () => {
  const points = useRef<THREE.Points>(null!);
  const particleCount = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.05;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#c9922a" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

export const FloatingLogo3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              ✦ Innovation Hub
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Where <span className="text-gradient-gold text-glow-gold">Ideas</span> Take Shape
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our creative process transforms abstract concepts into tangible digital experiences. 
              Every project begins with a spark of imagination and evolves through meticulous craft 
              into something extraordinary.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '100+', label: 'Designs Created' },
                { value: '24/7', label: 'AI-Powered' },
                { value: '3D', label: 'Immersive Tech' },
                { value: '99%', label: 'Client Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl glass border-glow">
                  <div className="text-2xl font-display font-bold text-gold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[500px] rounded-3xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={1} color="#c9922a" />
              <pointLight position={[-5, -5, 5]} intensity={0.5} color="#00d4ff" />
              <GoldSphere />
              <OrbitRings />
              <FloatingParticles3D />
              <Environment preset="night" />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
