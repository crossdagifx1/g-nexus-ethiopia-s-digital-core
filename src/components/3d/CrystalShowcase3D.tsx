import { useRef, useMemo, forwardRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Trail, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

const CrystalCluster = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.15 + pointer.x * 0.3;
    groupRef.current.rotation.x = pointer.y * 0.15;
  });

  const crystals = useMemo(() => [
    { pos: [0, 0, 0] as [number, number, number], scale: 1.2, rot: 0, color: '#c9922a', geo: 'octa' },
    { pos: [1.5, -0.3, 0.5] as [number, number, number], scale: 0.7, rot: 0.5, color: '#00d4ff', geo: 'octa' },
    { pos: [-1.2, -0.2, -0.4] as [number, number, number], scale: 0.85, rot: -0.3, color: '#c9922a', geo: 'dodeca' },
    { pos: [0.6, 1, -0.9] as [number, number, number], scale: 0.6, rot: 0.8, color: '#00d4ff', geo: 'tetra' },
    { pos: [-0.8, 0.6, 0.7] as [number, number, number], scale: 0.55, rot: -0.6, color: '#ff6b35', geo: 'octa' },
    { pos: [0.3, -1.1, 0.3] as [number, number, number], scale: 0.45, rot: 1.2, color: '#c9922a', geo: 'ico' },
    { pos: [-0.4, -0.8, -0.9] as [number, number, number], scale: 0.4, rot: -1, color: '#00d4ff', geo: 'tetra' },
  ], []);

  const getGeometry = (geo: string) => {
    switch (geo) {
      case 'dodeca': return <dodecahedronGeometry args={[0.7, 0]} />;
      case 'tetra': return <tetrahedronGeometry args={[0.7, 0]} />;
      case 'ico': return <icosahedronGeometry args={[0.7, 0]} />;
      default: return <octahedronGeometry args={[0.8, 0]} />;
    }
  };

  return (
    <group ref={groupRef}>
      {crystals.map((crystal, i) => (
        <Float key={i} speed={1.2 + i * 0.3} rotationIntensity={0.4} floatIntensity={0.6}>
          <group position={crystal.pos} scale={crystal.scale}>
            {/* Main crystal */}
            <mesh rotation={[crystal.rot, crystal.rot * 0.5, crystal.rot * 0.3]}>
              {getGeometry(crystal.geo)}
              <meshPhysicalMaterial
                color={crystal.color}
                metalness={0.15}
                roughness={0.02}
                transmission={0.85}
                thickness={0.6}
                ior={2.4}
                transparent
                opacity={0.85}
                envMapIntensity={2}
              />
            </mesh>
            {/* Inner glow wireframe */}
            <mesh rotation={[crystal.rot, crystal.rot * 0.5, crystal.rot * 0.3]} scale={0.6}>
              {getGeometry(crystal.geo)}
              <meshStandardMaterial
                color={crystal.color}
                emissive={crystal.color}
                emissiveIntensity={1.5}
                wireframe
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        </Float>
      ))}
      
      {/* Central energy core */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#c9922a" distance={5} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#00d4ff" distance={3} />
      
      {/* Orbiting energy particles */}
      <EnergyOrbit radius={2} speed={0.8} color="#c9922a" />
      <EnergyOrbit radius={1.8} speed={-0.6} color="#00d4ff" />
      <EnergyOrbit radius={2.3} speed={0.5} color="#ff6b35" />
    </group>
  );
};

const EnergyOrbitMesh = forwardRef<THREE.Mesh, { radius: number; speed: number; color: string }>(
  ({ radius, speed, color }, ref) => {
    const innerRef = useRef<THREE.Mesh>(null!);
    const meshRef = (ref as React.MutableRefObject<THREE.Mesh>) || innerRef;

    useFrame((state) => {
      const t = state.clock.elapsedTime * speed;
      if (meshRef.current) {
        meshRef.current.position.set(
          Math.cos(t) * radius,
          Math.sin(t * 1.3) * radius * 0.5,
          Math.sin(t) * radius
        );
      }
    });

    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
      </mesh>
    );
  }
);

const EnergyOrbit = ({ radius, speed, color }: { radius: number; speed: number; color: string }) => {
  return (
    <Trail width={0.15} length={10} color={color} attenuation={(w) => w * w}>
      <EnergyOrbitMesh radius={radius} speed={speed} color={color} />
    </Trail>
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
          <div className="h-[550px] rounded-3xl overflow-hidden border border-border/20">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} color="#c9922a" />
                <pointLight position={[-5, -3, 3]} intensity={0.8} color="#00d4ff" />
                <spotLight position={[0, 8, 0]} intensity={0.5} angle={0.6} penumbra={1} color="#c9922a" />
                <CrystalCluster />
                <DreiSparkles count={80} size={2} scale={6} color="#c9922a" speed={0.4} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
