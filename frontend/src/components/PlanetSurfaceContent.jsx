// components/PlanetSurfaceContent.jsx
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { planetPois } from '../data/planetPois.js';
import { latLonToXY } from "../utils/coordinates.js";
import "./css/PlanetSurfaceContent.css";

export function PlanetSurfaceContent({ planet }) {
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
  const pois = planetPois[planet] || [];

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

      {pois.map((poi, i) => {
        const [x, y] = latLonToXY(poi.lat, poi.lon, planeWidth, planeHeight);
        return (
          <Html
            key={i}
            position={[x, y, 0.1]}
            center
            style={{ pointerEvents: 'auto' }}
          >
            <button
              className="poi-pin"
              onClick={() => {
                console.log('Clicked POI:', poi.name, 'Search terms:', poi.searchTerms);
                // TODO: Calling the AI agent and/or Google Maps API
              }}
            >
              📍 {poi.name}
            </button>
          </Html>
        );
      })}
    </>
  );
}
