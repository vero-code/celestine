import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useAppStore } from '../stores/useAppStore';
import * as THREE from 'three';

const planetPositions = {
  Sun: new THREE.Vector3(0, 0, 0),
  Mercury: new THREE.Vector3(5, 0, 0),
  Venus: new THREE.Vector3(10, 0, 0),
  Earth: new THREE.Vector3(15, 0, 0),
  Mars: new THREE.Vector3(20, 0, 0),
};

function CameraRig() {
  const target = useAppStore((state) => state.target);
  const controlsEnabled = useAppStore((state) => !state.target);

  const targetPosition = useMemo(() => {
    if (!target) return new THREE.Vector3(0, 5, 40);
    const planetPos = planetPositions[target];

    return new THREE.Vector3(planetPos.x, planetPos.y + 2, planetPos.z + 10);
  }, [target]);

  useFrame((state, delta) => {
    state.camera.position.lerp(targetPosition, 0.5 * delta);

    if (!controlsEnabled) {
      const lookAtTarget = planetPositions[target];
      state.camera.lookAt(lookAtTarget);
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
  return (
    <Canvas camera={{ fov: 75, position: [0, 5, 40] }}>
      <color attach="background" args={['#000010']} />
      <ambientLight intensity={0.2} />

      {/* Sun - source of light */}
      <pointLight position={[0, 0, 0]} intensity={100} color="#FFDAB9" />

      {/* Orbit rings */}
      <OrbitRing radius={5} />
      <OrbitRing radius={10} />
      <OrbitRing radius={15} />
      <OrbitRing radius={20} />

      {/* Render of planets */}
      <mesh position={planetPositions.Sun}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#FFDAB9" emissive="#FFDAB9" emissiveIntensity={2} />
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Sun
        </Text>
      </mesh>

      <mesh position={planetPositions.Mercury}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="gray" />
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Mercury
        </Text>
      </mesh>

      <mesh position={planetPositions.Venus}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="orange" />
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Venus
        </Text>
      </mesh>

      <mesh position={planetPositions.Earth}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="deepskyblue" />
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Earth
        </Text>
      </mesh>

      <mesh position={planetPositions.Mars}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="orangered" />
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Mars
        </Text>
      </mesh>

      {/* OrbitControls for manual camera control */}
      <OrbitControls enabled={!useAppStore.getState().target} />

      <CameraRig />
    </Canvas>
  );
};

export default SpaceMap;