import { Float, Grid, Line, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";

const ArchitectureStack = () => {
  const groupRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.22;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.32) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0.45, 0.1, 0]}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
        <RoundedBox args={[2.6, 0.18, 2]} radius={0.08} smoothness={6} position={[0, -1.05, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.22} />
        </RoundedBox>
        <RoundedBox args={[2.05, 0.18, 1.55]} radius={0.08} smoothness={6} position={[-0.18, -0.45, -0.08]}>
          <meshStandardMaterial color="#111827" metalness={0.66} roughness={0.25} />
        </RoundedBox>
        <RoundedBox args={[1.62, 0.18, 1.18]} radius={0.08} smoothness={6} position={[0.12, 0.12, 0.02]}>
          <meshStandardMaterial color="#172554" metalness={0.74} roughness={0.18} />
        </RoundedBox>
        <RoundedBox args={[1.18, 0.16, 0.86]} radius={0.08} smoothness={6} position={[-0.08, 0.66, -0.06]}>
          <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.2} />
        </RoundedBox>
      </Float>

      <mesh position={[0.58, 0.18, 0.66]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.18, 1.85, 0.18]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[-0.92, -0.1, -0.4]} rotation={[0, -0.32, 0]}>
        <boxGeometry args={[0.14, 1.25, 0.14]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const DataRails = () => {
  const railsRef = useRef([]);

  useFrame(({ clock }) => {
    railsRef.current.forEach((line, index) => {
      if (!line) return;
      line.position.y = Math.sin(clock.elapsedTime * 0.42 + index) * 0.06;
      line.material.opacity = 0.22 + ((Math.sin(clock.elapsedTime * 0.7 + index) + 1) / 2) * 0.25;
    });
  });

  const lineSets = useMemo(
    () => [
      [
        [-3.2, 1.35, -1.4],
        [-1.1, 1.0, -0.55],
        [1.5, 0.78, 0.1],
        [3.1, 0.55, 1.05]
      ],
      [
        [-3.1, -0.15, -1.2],
        [-1.55, -0.06, -0.45],
        [0.8, 0.18, 0.35],
        [3.05, 0.25, 0.95]
      ],
      [
        [-3.15, -1.45, -0.95],
        [-0.9, -1.0, -0.2],
        [1.2, -0.62, 0.48],
        [3.05, -0.25, 0.98]
      ]
    ],
    []
  );

  return (
    <>
      {lineSets.map((points, index) => (
        <Line
          key={index}
          ref={(element) => {
            railsRef.current[index] = element;
          }}
          points={points}
          color={index === 1 ? "#f97316" : "#38bdf8"}
          lineWidth={1.1}
          transparent
          opacity={0.28}
        />
      ))}
    </>
  );
};

const SignalMarkers = () => {
  const markers = useRef([]);

  useFrame(({ clock }) => {
    markers.current.forEach((marker, index) => {
      if (!marker) return;
      marker.position.x = -2.7 + (((clock.elapsedTime * 0.38 + index * 1.6) % 4.8) / 4.8) * 5.4;
      marker.position.y = 0.9 - index * 0.95 + Math.sin(clock.elapsedTime * 0.42 + index) * 0.08;
      marker.material.emissiveIntensity = 0.9 + ((Math.sin(clock.elapsedTime * 1.2 + index) + 1) / 2) * 1.4;
    });
  });

  return (
    <>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(element) => {
            markers.current[index] = element;
          }}
          position={[-2.7, 0.9 - index * 0.95, index * 0.15]}
        >
          <boxGeometry args={[0.14, 0.14, 0.14]} />
          <meshStandardMaterial color={index === 1 ? "#f97316" : "#67e8f9"} emissive={index === 1 ? "#f97316" : "#67e8f9"} />
        </mesh>
      ))}
    </>
  );
};

const Scene = () => (
  <>
    <color attach="background" args={["#040816"]} />
    <fog attach="fog" args={["#040816", 8, 18]} />
    <ambientLight intensity={0.7} />
    <directionalLight position={[3.5, 5.5, 4]} intensity={1.8} color="#f8fafc" />
    <pointLight position={[4.5, 1.5, 1.5]} intensity={10} color="#38bdf8" distance={10} />
    <pointLight position={[-4.5, -1, 1]} intensity={7} color="#f97316" distance={10} />
    <ArchitectureStack />
    <DataRails />
    <SignalMarkers />
    <Grid
      position={[0, -1.75, 0]}
      args={[16, 10]}
      cellSize={0.6}
      cellThickness={0.5}
      cellColor="#1e293b"
      sectionSize={2.4}
      sectionThickness={1}
      sectionColor="#334155"
      fadeDistance={24}
      fadeStrength={1.2}
      infiniteGrid
    />
  </>
);

export const HeroScene = () => (
  <div className="hero-scene-shell">
    <div className="hero-scene-glow hero-scene-glow-one" />
    <div className="hero-scene-glow hero-scene-glow-two" />
    <Canvas camera={{ position: [0, 0, 7.2], fov: 38 }} dpr={[1, 1.8]}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
    <div className="hero-scene-grid" />
  </div>
);
