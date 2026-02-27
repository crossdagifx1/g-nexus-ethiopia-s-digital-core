import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Trail, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

const MouseTracker = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  useFrame(() => {
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.4, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.3, 0.05);
  });

  return <group ref={group}>{children}</group>;
};

const GoldSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    // Pulsing scale
    const pulse = 1 + Math.sin(t * 1.5) * 0.03;
    meshRef.current.scale.setScalar(pulse);
    // Inner core counter-rotation
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.5;
      innerRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group>
        {/* Outer distorted shell */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 4]} />
          <MeshDistortMaterial
            color="#c9922a"
            metalness={0.95}
            roughness={0.05}
            distort={0.3}
            speed={3}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Inner glowing core */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[0.8, 2]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
            wireframe
          />
        </mesh>
        {/* Energy shell */}
        <mesh>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            color="#c9922a"
            wireframe
            transparent
            opacity={0.08}
            emissive="#c9922a"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
};

const OrbitRings = () => {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.z = t * 0.15;
    group.current.rotation.x = Math.sin(t * 0.1) * 0.3;
  });

  return (
    <group ref={group}>
      {[2.5, 3.2, 3.9].map((radius, i) => (
        <group key={i}>
          <mesh rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
            <torusGeometry args={[radius, 0.025, 16, 100]} />
            <meshStandardMaterial
              color={i === 1 ? '#00d4ff' : '#c9922a'}
              emissive={i === 1 ? '#00d4ff' : '#c9922a'}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Orbiting mini-spheres on each ring */}
          <OrbitingSphere radius={radius} speed={0.5 + i * 0.2} offset={i * 2} color={i === 1 ? '#00d4ff' : '#c9922a'} tilt={Math.PI / 2 + i * 0.3} />
        </group>
      ))}
    </group>
  );
};

const OrbitingSphere = ({ radius, speed, offset, color, tilt }: { radius: number; speed: number; offset: number; color: string; tilt: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.position.y = Math.sin(t) * radius * Math.sin(tilt - Math.PI / 2);
  });

  return (
    <Trail width={0.3} length={8} color={color} attenuation={(w) => w * w}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
    </Trail>
  );
};

const FloatingParticles3D = () => {
  const points = useRef<THREE.Points>(null!);
  const particleCount = 500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const goldColor = new THREE.Color('#c9922a');
    const cyanColor = new THREE.Color('#00d4ff');
    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.5 ? goldColor : cyanColor;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
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
                <div key={stat.label} className="p-4 rounded-xl glass border-glow hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl font-display font-bold text-gold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[550px] rounded-3xl overflow-hidden border border-border/20">
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} color="#c9922a" />
                <pointLight position={[-5, -5, 5]} intensity={0.6} color="#00d4ff" />
                <spotLight position={[0, 10, 0]} intensity={0.4} angle={0.5} penumbra={1} color="#c9922a" />
                <MouseTracker>
                  <GoldSphere />
                  <OrbitRings />
                </MouseTracker>
                <FloatingParticles3D />
                <DreiSparkles count={60} size={2} scale={8} color="#c9922a" speed={0.5} />
                <Environment preset="night" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
