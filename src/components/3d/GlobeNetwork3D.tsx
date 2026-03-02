import { useRef, useMemo, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { LazyCanvas } from './LazyCanvas';
import * as THREE from 'three';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

// Generate brain-shaped node positions
function generateBrainNodes(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Ellipsoid brain shape
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.8 + (Math.random() - 0.5) * 0.6;
    const xScale = 1.4; // wider
    const yScale = 1.1; // tall
    const zScale = 1.0;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * xScale;
    positions[i * 3 + 1] = r * Math.cos(phi) * yScale;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * zScale;
  }
  return positions;
}

// Build connection indices between nearby nodes
function buildConnections(positions: Float32Array, nodeCount: number, maxDist: number): { indices: Uint16Array; count: number } {
  const pairs: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
        pairs.push(i, j);
      }
    }
  }
  return { indices: new Uint16Array(pairs), count: pairs.length };
}

const NeuralNetwork = ({ nodeCount = 80, maxDist = 1.2 }: { nodeCount?: number; maxDist?: number }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const nodesRef = useRef<THREE.InstancedMesh>(null!);
  const { pointer } = useThree();

  const { positions, connections, phases } = useMemo(() => {
    const pos = generateBrainNodes(nodeCount);
    const conn = buildConnections(pos, nodeCount, maxDist);
    const ph = new Float32Array(nodeCount);
    for (let i = 0; i < nodeCount; i++) ph[i] = Math.random() * Math.PI * 2;
    return { positions: pos, connections: conn, phases: ph };
  }, [nodeCount, maxDist]);

  // Line geometry
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Build line positions from connection indices
    const linePos = new Float32Array(connections.count * 3);
    for (let i = 0; i < connections.count; i++) {
      const nodeIdx = connections.indices[i];
      linePos[i * 3] = positions[nodeIdx * 3];
      linePos[i * 3 + 1] = positions[nodeIdx * 3 + 1];
      linePos[i * 3 + 2] = positions[nodeIdx * 3 + 2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    return geo;
  }, [positions, connections]);

  const lineMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying float vDist;
      varying vec3 vPos;
      void main() {
        vPos = position;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vDist = -mvPos.z;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying float vDist;
      varying vec3 vPos;
      void main() {
        // Liquid pulse with multiple wave layers
        float wave1 = sin(uTime * 2.5 + vDist * 0.8) * 0.5 + 0.5;
        float wave2 = sin(uTime * 1.3 + vPos.y * 2.0 + vDist * 0.4) * 0.5 + 0.5;
        float pulse = mix(wave1, wave2, 0.5) * 0.4 + 0.6;
        
        // Brighter gold and cyan
        vec3 gold = vec3(1.0, 0.78, 0.1);
        vec3 cyan = vec3(0.0, 0.95, 1.0);
        vec3 white = vec3(1.0, 1.0, 1.0);
        
        float t = sin(vPos.x * 0.8 + vPos.y * 0.5 + uTime * 0.7) * 0.5 + 0.5;
        vec3 color = mix(gold, cyan, t);
        // Add bright white hot spots
        color = mix(color, white, pow(pulse, 4.0) * 0.4);
        
        // High visibility alpha
        float alpha = pulse * 0.85;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    linewidth: 2,
  }), []);

  // Instance setup
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const baseColor = useMemo(() => new THREE.Color('#c9922a'), []);
  const brightColor = useMemo(() => new THREE.Color('#00d4ff'), []);

  // Init instances
  useMemo(() => {
    if (!nodesRef.current) return;
    for (let i = 0; i < nodeCount; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.06);
      dummy.updateMatrix();
      nodesRef.current.setMatrixAt(i, dummy.matrix);
      nodesRef.current.setColorAt(i, baseColor);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;
    if (nodesRef.current.instanceColor) nodesRef.current.instanceColor.needsUpdate = true;
  }, [positions, nodeCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.08 + pointer.x * 0.15;
    groupRef.current.rotation.x = pointer.y * 0.08;
    lineMaterial.uniforms.uTime.value = t;

    if (!nodesRef.current) return;
    const color = new THREE.Color();
    for (let i = 0; i < nodeCount; i++) {
      const pulse = Math.sin(t * 1.5 + phases[i]) * 0.5 + 0.5;
      // Much bigger nodes - 3x larger than before
      const s = 0.10 + pulse * 0.12;
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodesRef.current.setMatrixAt(i, dummy.matrix);
      color.copy(baseColor).lerp(brightColor, pulse * 0.8);
      nodesRef.current.setColorAt(i, color);
    }
    nodesRef.current.instanceMatrix.needsUpdate = true;
    if (nodesRef.current.instanceColor) nodesRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial emissive="#ffc030" emissiveIntensity={4} toneMapped={false} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
    </group>
  );
};

export const GlobeNetwork3D = () => {
  const { isMobile, dpr } = useDevicePerformance();
  const nodeCount = isMobile ? 60 : 120;
  const maxDist = isMobile ? 1.4 : 1.1;

  return (
    <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6">
          🧠 Neural Intelligence
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 md:mb-6">
          Powered by <span className="text-gradient-gold text-glow-gold">Intelligent Design</span>
        </h2>
        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-16">
          Every project we build is infused with smart architecture, AI-driven workflows,
          and neural-level precision.
        </p>
        <LazyCanvas className={`${isMobile ? 'h-[400px]' : 'h-[550px]'} rounded-3xl overflow-hidden max-w-3xl mx-auto mb-10 md:mb-16 border border-border/20`} camera={{ position: [0, 0, 6], fov: 45 }} dpr={dpr}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 3, 5]} intensity={5.0} color="#ffd060" />
            <pointLight position={[-3, -3, 5]} intensity={3.0} color="#00e5ff" />
            <pointLight position={[0, 5, -3]} intensity={2.0} color="#ffffff" />
            <pointLight position={[0, 0, 8]} intensity={3.0} color="#ffa500" />
            <NeuralNetwork nodeCount={nodeCount} maxDist={maxDist} />


          </Suspense>
        </LazyCanvas>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {[
            { value: '12+', label: 'AI Models Used' },
            { value: '50+', label: 'Smart Automations' },
            { value: '1M+', label: 'Data Points Analyzed' },
            { value: '∞', label: 'Neural Connections' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 md:p-6 rounded-2xl glass border-glow text-center group hover:scale-105 transition-all duration-500">
              <div className="text-2xl md:text-3xl font-display font-bold text-gold mb-1 md:mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
