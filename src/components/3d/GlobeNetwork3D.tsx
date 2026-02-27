import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Globe = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        color="#1a1510"
        metalness={0.3}
        roughness={0.7}
        wireframe={false}
        transparent
        opacity={0.9}
      />
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshStandardMaterial
          color="#c9922a"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </mesh>
  );
};

const ConnectionLines = () => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const connections = useMemo(() => {
    const points: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    // Ethiopia (Addis Ababa) approximate position on sphere
    const ethLat = 9 * (Math.PI / 180);
    const ethLon = 38 * (Math.PI / 180);
    const ethPos = new THREE.Vector3(
      2.1 * Math.cos(ethLat) * Math.sin(ethLon),
      2.1 * Math.sin(ethLat),
      2.1 * Math.cos(ethLat) * Math.cos(ethLon)
    );

    const cities = [
      { lat: 51.5, lon: -0.1 }, // London
      { lat: 40.7, lon: -74 },  // NYC
      { lat: 25.2, lon: 55.3 }, // Dubai
      { lat: 35.7, lon: 139.7 }, // Tokyo
      { lat: -33.9, lon: 18.4 }, // Cape Town
      { lat: 1.3, lon: 103.8 },  // Singapore
    ];

    cities.forEach((city, i) => {
      const lat = city.lat * (Math.PI / 180);
      const lon = city.lon * (Math.PI / 180);
      const pos = new THREE.Vector3(
        2.1 * Math.cos(lat) * Math.sin(lon),
        2.1 * Math.sin(lat),
        2.1 * Math.cos(lat) * Math.cos(lon)
      );
      points.push({
        start: ethPos,
        end: pos,
        color: i % 2 === 0 ? '#c9922a' : '#00d4ff',
      });
    });
    return points;
  }, []);

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Ethiopia marker */}
      <mesh position={[
        2.1 * Math.cos(9 * Math.PI / 180) * Math.sin(38 * Math.PI / 180),
        2.1 * Math.sin(9 * Math.PI / 180),
        2.1 * Math.cos(9 * Math.PI / 180) * Math.cos(38 * Math.PI / 180)
      ]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#c9922a" emissive="#c9922a" emissiveIntensity={2} />
      </mesh>

      {/* Connection endpoints */}
      {connections.map((conn, i) => (
        <mesh key={i} position={conn.end}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={conn.color} emissive={conn.color} emissiveIntensity={1} />
        </mesh>
      ))}
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
          Our roots are Ethiopian, but our reach is global. We serve clients across 
          continents, bringing Habesha creativity and technical excellence everywhere.
        </p>
        <div className="h-[500px] rounded-3xl overflow-hidden max-w-3xl mx-auto mb-16">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 3, 5]} intensity={0.8} color="#c9922a" />
            <pointLight position={[-3, -3, 5]} intensity={0.5} color="#00d4ff" />
            <Globe />
            <ConnectionLines />
            <Environment preset="night" />
          </Canvas>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: '6+', label: 'Countries Served' },
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
