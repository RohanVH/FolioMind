import { Float, MeshDistortMaterial, OrbitControls, Sphere, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const ParticleField = () => {
  const pointsRef = useRef(null);
  const positions = useMemo(() => {
    const values = new Float32Array(180 * 3);
    for (let index = 0; index < values.length; index += 3) {
      values[index] = (Math.random() - 0.5) * 10;
      values[index + 1] = (Math.random() - 0.5) * 6;
      values[index + 2] = (Math.random() - 0.5) * 8;
    }
    return values;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.05;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#f8fafc" size={0.03} sizeAttenuation transparent opacity={0.65} />
    </points>
  );
};

const EnergyCore = () => {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.22;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.2) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.4} rotationIntensity={0.55} floatIntensity={0.7}>
        <Sphere args={[1.25, 128, 128]} scale={1.05}>
          <MeshDistortMaterial
            color="#7dd3fc"
            emissive="#22d3ee"
            emissiveIntensity={1.25}
            roughness={0.15}
            metalness={0.55}
            distort={0.32}
            speed={2.2}
          />
        </Sphere>
      </Float>
      <mesh rotation={[Math.PI / 2.8, 0, 0]}>
        <torusGeometry args={[2.1, 0.04, 32, 180]} />
        <meshStandardMaterial color="#f97316" emissive="#fb923c" emissiveIntensity={2.4} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 1.9, 0.4, 0.3]}>
        <torusGeometry args={[2.8, 0.025, 24, 180]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1.8} transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

const Scene = () => (
  <>
    <color attach="background" args={["#050816"]} />
    <fog attach="fog" args={["#050816", 8, 18]} />
    <ambientLight intensity={0.7} />
    <directionalLight position={[5, 4, 4]} intensity={1.8} color="#f8fafc" />
    <pointLight position={[-4, -2, 2]} intensity={18} color="#f97316" distance={12} />
    <pointLight position={[4, 2, 0]} intensity={14} color="#22d3ee" distance={12} />
    <ParticleField />
    <Stars radius={40} depth={18} count={2500} factor={3} saturation={0} fade speed={0.4} />
    <EnergyCore />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
  </>
);

export const HeroScene = () => (
  <div className="hero-scene-shell">
    <div className="hero-scene-glow hero-scene-glow-one" />
    <div className="hero-scene-glow hero-scene-glow-two" />
    <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.8]}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
    <div className="hero-scene-grid" />
  </div>
);
