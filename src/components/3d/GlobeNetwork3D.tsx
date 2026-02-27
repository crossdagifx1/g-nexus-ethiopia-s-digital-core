import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Trail, Sparkles as DreiSparkles } from '@react-three/drei';
import * as THREE from 'three';

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const atmosphereRef = useRef<THREE.Mesh>(null!);
  const { pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.12 + pointer.x * 0.2;
    meshRef.current.rotation.x = pointer.y * 0.1;
    // Atmosphere pulse
    if (atmosphereRef.current) {
      const s = 1 + Math.sin(t * 0.8) * 0.01;
      atmosphereRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhysicalMaterial
          color="#1a1510"
          metalness={0.4}
          roughness={0.6}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[1.98, 32, 32]} />
          <meshStandardMaterial
            color="#c9922a"
            emissive="#c9922a"
            emissiveIntensity={0.15}
            transparent
            opacity={0.4}
          />
        </mesh>
      </mesh>
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.15, 32, 32]} />
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

const latLonToVec3 = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
};

const ArcConnection = ({ start, end, color }: { start: THREE.Vector3; end: THREE.Vector3; color: string }) => {
  const lineRef = useRef<any>(null!);

  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(3.5);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const lineObj = useMemo(() => {
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
    return new THREE.Line(geometry, material);
  }, [curve, color]);

  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return <primitive ref={lineRef} object={lineObj} />;
};

const TravelingPulse = ({ start, end, color, speed }: { start: THREE.Vector3; end: THREE.Vector3; color: string; speed: number }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(3.5);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  useFrame((state) => {
    const t = (state.clock.elapsedTime * speed) % 1;
    const pos = curve.getPoint(t);
    ref.current.position.copy(pos);
  });

  return (
    <Trail width={0.15} length={6} color={color} attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
      </mesh>
    </Trail>
  );
};

const ConnectionNetwork = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  const cities = useMemo(() => [
    { name: 'Addis Ababa', lat: 9.02, lon: 38.75, isHome: true },
    { name: 'London', lat: 51.5, lon: -0.1 },
    { name: 'New York', lat: 40.7, lon: -74 },
    { name: 'Dubai', lat: 25.2, lon: 55.3 },
    { name: 'Tokyo', lat: 35.7, lon: 139.7 },
    { name: 'Cape Town', lat: -33.9, lon: 18.4 },
    { name: 'Singapore', lat: 1.3, lon: 103.8 },
    { name: 'Berlin', lat: 52.5, lon: 13.4 },
    { name: 'Sydney', lat: -33.9, lon: 151.2 },
  ], []);

  const connections = useMemo(() => {
    const homePos = latLonToVec3(cities[0].lat, cities[0].lon, 2.15);
    return cities.slice(1).map((city, i) => ({
      start: homePos,
      end: latLonToVec3(city.lat, city.lon, 2.15),
      color: i % 2 === 0 ? '#c9922a' : '#00d4ff',
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, [cities]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.12 + pointer.x * 0.2;
    groupRef.current.rotation.x = pointer.y * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* City markers */}
      {cities.map((city, i) => {
        const pos = latLonToVec3(city.lat, city.lon, 2.15);
        return (
          <group key={city.name}>
            <mesh position={pos}>
              <sphereGeometry args={[city.isHome ? 0.08 : 0.04, 16, 16]} />
              <meshStandardMaterial
                color={city.isHome ? '#c9922a' : '#00d4ff'}
                emissive={city.isHome ? '#c9922a' : '#00d4ff'}
                emissiveIntensity={city.isHome ? 3 : 1.5}
              />
            </mesh>
            {/* Marker ring for home city */}
            {city.isHome && (
              <mesh position={pos}>
                <ringGeometry args={[0.12, 0.15, 32]} />
                <meshStandardMaterial
                  color="#c9922a"
                  emissive="#c9922a"
                  emissiveIntensity={1}
                  transparent
                  opacity={0.5}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}
      {/* City markers only - no satellite lines */}
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
            <ambientLight intensity={0.15} />
            <directionalLight position={[5, 3, 5]} intensity={0.8} color="#c9922a" />
            <pointLight position={[-3, -3, 5]} intensity={0.5} color="#00d4ff" />
            <Globe />
            <ConnectionNetwork />
            <DreiSparkles count={30} size={1} scale={6} color="#c9922a" speed={0.3} />
            <Environment preset="night" />
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
