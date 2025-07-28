// components/PlanetSurface2D.jsx
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera, MapControls, Html } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import { PlanetSurfaceContent } from './PlanetSurfaceContent';

function CameraSetup() {
  const { camera, viewport } = useThree();

  useEffect(() => {
    camera.left = -viewport.width / 2;
    camera.right = viewport.width / 2;
    camera.top = viewport.height / 2;
    camera.bottom = -viewport.height / 2;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [camera, viewport]);

  return <OrthographicCamera makeDefault position={[0, 0, 10]} near={0.1} far={1000} />;
}

export function PlanetSurface2D({ planet }) {
  return (
    <Canvas orthographic>
      <color attach="background" args={['#000']} />

      <CameraSetup />

      <ambientLight intensity={0.5} />

      <Suspense fallback={
        <Html center style={{ color: '#fff' }}>Loading texture…</Html>
      }>
        <PlanetSurfaceContent planet={planet} />
      </Suspense>

      <MapControls
        enablePan={false}
        enableRotate={false}
        target={[0, 0, 0]}
        makeDefault
      />

    </Canvas>
  );
}
