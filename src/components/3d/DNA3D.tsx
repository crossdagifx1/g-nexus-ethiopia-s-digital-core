import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

const DNAHelix = ({ helixCount = 60 }: { helixCount?: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const strandRefs1 = useRef<THREE.Mesh[]>([]);
  const strandRefs2 = useRef<THREE.Mesh[]>([]);
  const { pointer } = useThree();

  const helixData = useMemo(() => {
    return Array.from({ length: helixCount }, (_, i) => {
      const t = (i / helixCount) * Math.PI * 6;
      const y = (i / helixCount) * 10 - 5;
      return { t, y };
    });
  }, [helixCount]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.25 + pointer.x * 0.3;

    helixData.forEach((data, i) => {
      const waveT = data.t + time * 0.8;
      const breathe = 1 + Math.sin(time * 0.5) * 0.15;
      const r = 1.5 * breathe;

      if (strandRefs1.current[i]) {
        strandRefs1.current[i].position.set(Math.cos(waveT) * r, data.y, Math.sin(waveT) * r);
        const s = 0.12 + Math.sin(time * 2 + i * 0.2) * 0.03;
        strandRefs1.current[i].scale.setScalar(s / 0.12);
      }
      if (strandRefs2.current[i]) {
        strandRefs2.current[i].position.set(Math.cos(waveT + Math.PI) * r, data.y, Math.sin(waveT + Math.PI) * r);
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
            <meshStandardMaterial color="#c9922a" emissive="#c9922a" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh ref={el => { if (el) strandRefs2.current[i] = el; }} position={[Math.cos(data.t + Math.PI) * 1.5, data.y, Math.sin(data.t + Math.PI) * 1.5]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const DNA3D = () => {
  const { isMobile, dpr, particleScale } = useDevicePerformance();
  const helixCount = isMobile ? 30 : 60;

  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/20" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className={`${isMobile ? 'h-[350px]' : 'h-[550px]'} rounded-3xl overflow-hidden order-2 lg:order-1 border border-border/20`}>
            <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={dpr}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#c9922a" />
                <pointLight position={[-5, -5, 5]} intensity={0.6} color="#00d4ff" />
                <pointLight position={[0, 0, 3]} intensity={0.3} color="#c9922a" />
                <DNAHelix helixCount={helixCount} />
                <DreiSparkles count={isMobile ? 25 : 50} size={1.5} scale={8} color="#c9922a" speed={0.4} />
                <Environment preset="night" />
              </Suspense>
            </Canvas>
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
              ⚡ AI & Automation
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 md:mb-6">
              The <span className="text-gradient-gold text-glow-gold">DNA</span> of Innovation
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
              Like a double helix, our solutions interweave cutting-edge AI with human creativity. 
              We build intelligent systems that don't just automate — they think, adapt, and evolve.
            </p>
            <div className="space-y-3 md:space-y-4">
              {[
                { title: 'Neural Network Agents', desc: 'Custom AI that learns your business patterns' },
                { title: 'Predictive Analytics', desc: 'Forecast trends before they happen' },
                { title: 'Process Automation', desc: 'Eliminate repetitive tasks with smart workflows' },
                { title: 'Natural Language AI', desc: 'Chatbots that understand Amharic, English & Tigrinya' },
              ].map((item, i) => (
                <div key={item.title} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-muted/30 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 group-hover:scale-110 transition-all">
                    <span className="text-gold font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground group-hover:text-gold transition-colors">{item.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
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
