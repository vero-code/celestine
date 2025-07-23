import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { useAppStore } from '../stores/useAppStore';
import * as THREE from 'three';
import './css/InfoBox.css';
import { planetData } from "../data/planetData.js";

function CameraRig() {
  const target = useAppStore((state) => state.target);
  const isUserControlling = useAppStore((state) => state.isUserControlling);

  const targetPosition = useMemo(() => {
    if (!target) return new THREE.Vector3(0, 5, 40);
    const planet = planetData.find((p) => p.name === target);
    if (!planet) return new THREE.Vector3(0, 5, 40);

    // The displacement depends on the size of the planet
    const zoomFactor = Math.max(planet.radius * 5, 6);
    return new THREE.Vector3(planet.position.x, planet.position.y + 2, planet.position.z + zoomFactor);
  }, [target]);

  useFrame((state, delta) => {
    if (!isUserControlling && target) {
       state.camera.position.lerp(targetPosition, 0.5 * delta);
       const lookAtTarget = planetData.find((p) => p.name === target)?.position;
       if (lookAtTarget) state.camera.lookAt(lookAtTarget);
    }
  });

  return null;
}

const OrbitRing = ({ radius }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
    <meshBasicMaterial color="#888" side={THREE.DoubleSide} transparent opacity={0.5} />
  </mesh>
);

const SpaceMap = () => {
  const setTarget = useAppStore((state) => state.setTarget);
  const currentTarget = useAppStore((state) => state.target);
  const setUserControlling = useAppStore((state) => state.setUserControlling);

  return (
    <Canvas
      camera={{ fov: 75, position: [0, 5, 40] }}
      onPointerMissed={() => setTarget(null)}
    >
      <color attach="background" args={['#000010']} />
      <ambientLight intensity={0.2} />

      {/* Sun - source of light */}
      <pointLight position={[0, 0, 0]} intensity={100} color="#FFDAB9" />

      {/* Orbit rings */}
      {planetData.map((planet) => (
        <OrbitRing key={planet.name} radius={planet.position.x} />
      ))}

      {/* Render of planets */}
      {planetData.map((planet) => (
        <mesh
          key={planet.name}
          position={planet.position}
          onClick={(e) => {
            e.stopPropagation();
            setTarget(planet.name);
          }}
        >
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={planet.emissive ? planet.color : '#000'}
            emissiveIntensity={planet.emissive ? 2 : 0}
          />

          {/* Label */}
          <Text
            position={[0, planet.radius + 0.8, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {planet.name}
          </Text>

          {/* Info box */}
          {currentTarget === planet.name && (
            <Html position={[0, planet.radius + 2, 0]} distanceFactor={10}>
              <div className="info-box">
                <h4>{planet.name}</h4>
                <p>{planet.info}</p>
              </div>
            </Html>
          )}
        </mesh>
      ))}

      {/* OrbitControls for manual camera control */}
      <OrbitControls
        enabled={!currentTarget}
        onStart={() => setUserControlling(true)}
        onEnd={() => setUserControlling(false)}
      />

      <CameraRig />
    </Canvas>
  );
};

export default SpaceMap;