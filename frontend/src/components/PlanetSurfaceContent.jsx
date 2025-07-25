// components/PlanetSurfaceContent.jsx
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';

export function PlanetSurfaceContent({ planet, pois }) {
  const texturePath = `/textures/${planet.toLowerCase()}_equirect.jpg`;
  const texture = useTexture(texturePath);

  const { viewport } = useThree();

  const { width, height } = useMemo(() => {
    const img =
      texture?.source?.data ??
      texture?.image;
    return {
      width: img?.width ?? 4096,
      height: img?.height ?? 2048,
    };
  }, [texture]);

  const textureAspect = height / width;

  let planeWidth, planeHeight;

  if (viewport.height / viewport.width > textureAspect) {
    planeHeight = viewport.height;
    planeWidth = planeHeight / textureAspect;
  } else {
    planeWidth = viewport.width;
    planeHeight = planeWidth * textureAspect;
  }

  console.log('Texture dimensions:', { width, height, textureAspect, texturePath });
  console.log('Viewport dimensions:', { vw: viewport.width, vh: viewport.height });
  console.log('Calculated Plane dimensions:', { planeWidth, planeHeight });

  if (!width || !height || !isFinite(planeHeight) || !isFinite(planeWidth)) {
    return (
      <Html center style={{ color: 'red', background: '#111', padding: 8 }}>
        ⚠️ Texture not ready or invalid: {texturePath}
      </Html>
    );
  }

  return (
    <>
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* TODO: Add POI */}
    </>
  );
}
