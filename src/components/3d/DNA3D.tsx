import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Trail, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const helixCount = 60;
  const strandRefs1 = useRef<THREE.Mesh[]>([]);
  const strandRefs2 = useRef<THREE.Mesh[]>([]);
  const { pointer } = useThree();

  const helixData = useMemo(() => {
    return Array.from({ length: helixCount }, (_, i) => {
      const t = (i / helixCount) * Math.PI * 6;
      const y = (i / helixCount) * 10 - 5;
      return { t, y };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.25 + pointer.x * 0.3;

    helixData.forEach((data, i) => {
      const waveT = data.t + time * 0.8;
      const breathe = 1 + Math.sin(time * 0.5) * 0.15;
      const r = 1.5 * breathe;

      if (strandRefs1.current[i]) {
        strandRefs1.current[i].position.set(
          Math.cos(waveT) * r,
          data.y,
          Math.sin(waveT) * r
        );
        // Pulsing size
        const s = 0.12 + Math.sin(time * 2 + i * 0.2) * 0.03;
        strandRefs1.current[i].scale.setScalar(s / 0.12);
      }
      if (strandRefs2.current[i]) {
        strandRefs2.current[i].position.set(
          Math.cos(waveT + Math.PI) * r,
          data.y,
          Math.sin(waveT + Math.PI) * r
        );
        const s = 0.12 + Math.sin(time * 2 + i * 0.2 + Math.PI) * 0.03;
        strandRefs2.current[i].scale.setScalar(s / 0.12);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {helixData.map((data, i) => (
        <group key={i}>
          <mesh ref={el => { if (el) strandRefs1.current[i] = el; }} position={[Math.cos(data.t) * 1.5, data.y, Math.sin(data.t) * 1.5]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#c9922a"
              emissive="#c9922a"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh ref={el => { if (el) strandRefs2.current[i] = el; }} position={[Math.cos(data.t + Math.PI) * 1.5, data.y, Math.sin(data.t + Math.PI) * 1.5]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Connecting bars with glow */}
          {i % 3 === 0 && (
            <ConnectingBar index={i} data={data} />
          )}
        </group>
      ))}
      {/* Electron particles orbiting */}
      <ElectronOrbit radius={2.5} speed={1.5} color="#c9922a" yRange={5} />
      <ElectronOrbit radius={2.2} speed={-1.2} color="#00d4ff" yRange={4} />
    </group>
  );
};

const ConnectingBar = ({ index, data }: { index: number; data: { t: number; y: number } }) => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const opacity = 0.1 + Math.sin(time * 2 + index * 0.5) * 0.1;
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).opacity = opacity;
    }
  });

  return (
    <mesh ref={ref} position={[0, data.y, 0]}>
      <cylinderGeometry args={[0.015, 0.015, 3, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#c9922a"
        emissiveIntensity={0.3}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

const ElectronOrbit = ({ radius, speed, color, yRange }: { radius: number; speed: number; color: string; yRange: number }) => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.7) * yRange,
      Math.sin(t) * radius
    );
  });

  return (
    <Trail width={0.2} length={12} color={color} attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
      </mesh>
    </Trail>
  );
};

export const DNA3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/20" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="h-[550px] rounded-3xl overflow-hidden order-2 lg:order-1 border border-border/20">
            <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[5, 5, 5]} intensity={1} color="#c9922a" />
              <pointLight position={[-5, -5, 5]} intensity={0.6} color="#00d4ff" />
              <pointLight position={[0, 0, 3]} intensity={0.3} color="#c9922a" />
              <DNAHelix />
              <DreiSparkles count={50} size={1.5} scale={8} color="#c9922a" speed={0.4} />
              <Environment preset="night" />
            </Canvas>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              ⚡ AI & Automation
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              The <span className="text-gradient-gold text-glow-gold">DNA</span> of Innovation
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Like a double helix, our solutions interweave cutting-edge AI with human creativity. 
              We build intelligent systems that don't just automate — they think, adapt, and evolve.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Neural Network Agents', desc: 'Custom AI that learns your business patterns' },
                { title: 'Predictive Analytics', desc: 'Forecast trends before they happen' },
                { title: 'Process Automation', desc: 'Eliminate repetitive tasks with smart workflows' },
                { title: 'Natural Language AI', desc: 'Chatbots that understand Amharic, English & Tigrinya' },
              ].map((item, i) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 group-hover:scale-110 transition-all">
                    <span className="text-gold font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground group-hover:text-gold transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
