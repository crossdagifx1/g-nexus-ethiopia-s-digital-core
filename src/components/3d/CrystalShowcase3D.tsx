import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CrystalCluster = () => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  const crystals = useMemo(() => [
    { pos: [0, 0, 0] as [number, number, number], scale: 1, rot: 0 },
    { pos: [1.2, -0.3, 0.5] as [number, number, number], scale: 0.7, rot: 0.5 },
    { pos: [-1, -0.2, -0.3] as [number, number, number], scale: 0.8, rot: -0.3 },
    { pos: [0.5, 0.8, -0.8] as [number, number, number], scale: 0.6, rot: 0.8 },
    { pos: [-0.7, 0.5, 0.6] as [number, number, number], scale: 0.5, rot: -0.6 },
  ], []);

  return (
    <group ref={groupRef}>
      {crystals.map((crystal, i) => (
        <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh position={crystal.pos} scale={crystal.scale} rotation={[crystal.rot, crystal.rot * 0.5, 0]}>
            <octahedronGeometry args={[0.8, 0]} />
            <meshPhysicalMaterial
              color={i % 2 === 0 ? '#c9922a' : '#00d4ff'}
              metalness={0.1}
              roughness={0.05}
              transmission={0.9}
              thickness={0.5}
              ior={2.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
      {/* Center glow */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#c9922a" distance={5} />
    </group>
  );
};

export const CrystalShowcase3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-background to-card/30" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-6">
              💎 Premium Quality
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              Crafted with <span className="text-gradient-cyber">Precision</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Like precious gems forged under pressure, our digital products are the result 
              of intense focus, expertise, and an uncompromising commitment to quality.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Pixel-Perfect Design', pct: 98 },
                { title: 'Performance Score', pct: 95 },
                { title: 'Code Quality', pct: 97 },
                { title: 'Client Retention', pct: 100 },
              ].map((item) => (
                <div key={item.title}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                    <span className="text-sm text-gold font-bold">{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-cyan transition-all duration-1000"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[500px] rounded-3xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={1.2} color="#c9922a" />
              <pointLight position={[-5, -3, 3]} intensity={0.8} color="#00d4ff" />
              <CrystalCluster />
              <Environment preset="studio" />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
