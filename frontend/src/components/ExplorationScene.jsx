import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAppStore } from '../stores/useAppStore';
import * as THREE from 'three';

// Map of planet positions in 3D space
const planetPositions = {
  Sun: new THREE.Vector3(0, 0, 0),
  Mercury: new THREE.Vector3(5, 0, 0),
  Venus: new THREE.Vector3(10, 0, 0),
  Earth: new THREE.Vector3(15, 0, 0),
  Mars: new THREE.Vector3(20, 0, 0),
};

// Control camera
function CameraRig() {
  const target = useAppStore((state) => state.target);
  const controlsEnabled = useAppStore((state) => !state.target);

  // useMemo caches the target position to avoid creating a new vector for each render
  const targetPosition = useMemo(() => {
    if (!target) return new THREE.Vector3(0, 5, 40); // Starting/free position

    const planetPos = planetPositions[target];
    // The camera looks at the planet from a short distance
    return new THREE.Vector3(planetPos.x, planetPos.y + 2, planetPos.z + 10);
  }, [target]);

  // useFrame - a hook that runs on every frame
  useFrame((state, delta) => {
    // Smoothly move the camera to the target position
    state.camera.position.lerp(targetPosition, 0.5 * delta);

    // Only apply lookAt if OrbitControls are NOT enabled (i.e., we are targeting a specific planet)
    if (!controlsEnabled) {
      const lookAtTarget = planetPositions[target];
      state.camera.lookAt(lookAtTarget);
    }
  });

  return null;
}

const ExplorationScene = () => {
  return (
    <Canvas camera={{ fov: 75, position: [0, 5, 40] }}>
      <color attach="background" args={['#000010']} />
      <ambientLight intensity={0.2} />

      {/* Sun - source of light */}
      <pointLight position={[0, 0, 0]} intensity={100} color="#FFDAB9" />

      {/* Render of planets */}
      <mesh position={planetPositions.Sun}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#FFDAB9" emissive="#FFDAB9" emissiveIntensity={2} />
      </mesh>

      <mesh position={planetPositions.Mercury}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <mesh position={planetPositions.Venus}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh position={planetPositions.Earth}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="deepskyblue" />
      </mesh>

      <mesh position={planetPositions.Mars}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="orangered" />
      </mesh>

      {/* OrbitControls for manual camera control */}
      <OrbitControls enabled={!useAppStore.getState().target} />

      <CameraRig />
    </Canvas>
  );
};

export default ExplorationScene;