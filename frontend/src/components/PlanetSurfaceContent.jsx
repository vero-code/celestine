// components/PlanetSurfaceContent.jsx
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { planetPois } from '../data/planetPois.js';
import { latLonToXY } from "../utils/coordinates.js";
import "./css/PlanetSurfaceContent.css";
import { useAppStore } from "../stores/useAppStore.js";
import { usePlacesStore } from '../stores/usePlacesStore.js';

export function PlanetSurfaceContent({ planet }) {
  const texturePath = `/textures/${planet.toLowerCase()}_equirect.jpg`;
  const texture = useTexture(texturePath);

  const { viewport } = useThree();
  const sendPoiPromptToChat = useAppStore((state) => state.sendPoiPromptToChat);
  const searchPlaces = usePlacesStore((state) => state.searchPlaces);

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

  if (!width || !height || !isFinite(planeHeight) || !isFinite(planeWidth)) {
    return (
      <Html center style={{ color: 'red', background: '#111', padding: 8 }}>
        ⚠️ Texture not ready or invalid: {texturePath}
      </Html>
    );
  }

  const handlePoiClick = async (poi) => {
    console.log('Clicked POI:', poi.name, 'Search terms:', poi.searchTerms);

    // 1. Send a prompt to an AI agent
    const promptMessage = poi.aiPrompt || `Tell me about "${poi.name}" and its analogues on Earth.`;
    try {
      await sendPoiPromptToChat(promptMessage);
    } catch (error) {
      console.error("Error sending POI prompt to backend:", error);
    }

    // 2. Call Places API via Backend
    if (poi.searchTerms && poi.searchTerms.length > 0) {
      const searchQuery = poi.searchTerms.join(' ');
      console.log('Searching places for:', searchQuery);
      try {
        await searchPlaces(searchQuery);
        // TODO: Add logic to display results
      } catch (error) {
        console.error("Failed to search places:", error);
      }
    } else {
      console.warn("No search terms defined for this POI.");
    }
  };

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
              onClick={() => handlePoiClick(poi)}
            >
              📍 {poi.name}
            </button>
          </Html>
        );
      })}
    </>
  );
}
