import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const helixCount = 40;

  const helixData = useMemo(() => {
    return Array.from({ length: helixCount }, (_, i) => {
      const t = (i / helixCount) * Math.PI * 4;
      const y = (i / helixCount) * 8 - 4;
      return {
        pos1: [Math.cos(t) * 1.5, y, Math.sin(t) * 1.5] as [number, number, number],
        pos2: [Math.cos(t + Math.PI) * 1.5, y, Math.sin(t + Math.PI) * 1.5] as [number, number, number],
        y,
        t,
      };
    });
  }, []);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <group ref={groupRef}>
      {helixData.map((data, i) => (
        <group key={i}>
          {/* Strand 1 */}
          <mesh position={data.pos1}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#c9922a"
              emissive="#c9922a"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Strand 2 */}
          <mesh position={data.pos2}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Connecting bar every 3rd */}
          {i % 3 === 0 && (
            <mesh position={[(data.pos1[0] + data.pos2[0]) / 2, data.y, (data.pos1[2] + data.pos2[2]) / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.15}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

export const DNA3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/20" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="h-[500px] rounded-3xl overflow-hidden order-2 lg:order-1">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={1} color="#c9922a" />
              <pointLight position={[-5, -5, 5]} intensity={0.6} color="#00d4ff" />
              <DNAHelix />
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
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 transition-colors">
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
