import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles as DreiSparkles, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

const LiquidGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  const { pointer } = useThree();

  const liquidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#1a1510') },
        uColor2: { value: new THREE.Color('#c9922a') },
        uColor3: { value: new THREE.Color('#00d4ff') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;
        
        // Simplex-like noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normal;
          vPosition = position;
          vUv = uv;
          
          float displacement = snoise(position * 1.5 + uTime * 0.3) * 0.15;
          displacement += snoise(position * 3.0 + uTime * 0.5) * 0.05;
          vec3 newPosition = position + normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          
          float pattern = sin(vPosition.x * 4.0 + uTime) * sin(vPosition.y * 4.0 + uTime * 0.7) * sin(vPosition.z * 4.0 + uTime * 0.5);
          pattern = pattern * 0.5 + 0.5;
          
          vec3 color = mix(uColor1, uColor2, pattern);
          color = mix(color, uColor3, fresnel * 0.6);
          color += uColor2 * fresnel * 0.4;
          
          float alpha = 0.85 + fresnel * 0.15;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.12 + pointer.x * 0.2;
    meshRef.current.rotation.x = pointer.y * 0.1;
    liquidMaterial.uniforms.uTime.value = t;
    if (atmosphereRef.current) {
      const s = 1 + Math.sin(t * 0.8) * 0.02;
      atmosphereRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} material={liquidMaterial}>
        <sphereGeometry args={[2, 128, 128]} />
      </mesh>
      {/* Outer glow atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshStandardMaterial
          color="#c9922a"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};


export const GlobeNetwork3D = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
          🌍 Global Reach
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
          From <span className="text-gradient-gold text-glow-gold">Addis Ababa</span> to the World
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
          Our roots are Ethiopian, but our reach is global. Move your mouse to explore 
          our worldwide connections.
        </p>
        <div className="h-[550px] rounded-3xl overflow-hidden max-w-3xl mx-auto mb-16 border border-border/20">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.15} />
              <directionalLight position={[5, 3, 5]} intensity={0.8} color="#c9922a" />
              <pointLight position={[-3, -3, 5]} intensity={0.5} color="#00d4ff" />
              <LiquidGlobe />
              <Center position={[0, 0, 2.5]}>
                <Text
                  fontSize={1.8}
                  letterSpacing={0.15}
                  font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
                  anchorX="center"
                  anchorY="middle"
                >
                  AI
                  <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                  />
                </Text>
              </Center>
              <DreiSparkles count={30} size={1} scale={6} color="#c9922a" speed={0.3} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '8+', label: 'Countries Served' },
            { value: '3', label: 'Languages Supported' },
            { value: '24/7', label: 'Global Availability' },
            { value: '∞', label: 'Ambition' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-2xl glass border-glow text-center group hover:scale-105 transition-all duration-500">
              <div className="text-3xl font-display font-bold text-gold mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
