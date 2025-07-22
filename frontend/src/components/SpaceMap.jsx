import React, { useEffect, useRef } from 'react';

const SpaceMap = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.querySelector("script[data-maps-3d]");
      if (existingScript) return;

      const script = document.createElement("script");
      const params = new URLSearchParams({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        v: "alpha",
      });

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.setAttribute("data-maps-3d", "true");
      document.head.appendChild(script);
    };

    const initMap = async () => {
      try {
        const { Map3DElement, MapMode, Polygon3DElement } = await window.google.maps.importLibrary("maps3d");

        const map3DElement = new Map3DElement({
          center: { lat: 43.6425, lng: -79.3871, altitude: 400 },
          range: 1000,
          tilt: 60,
          mode: MapMode.SATELLITE,
        });

        const polygonOptions = {
          strokeColor: "#EA433580",
          strokeWidth: 4,
          fillColor: "#0000FF80",
          altitudeMode: "ABSOLUTE",
          extruded: true,
          drawsOccludedSegments: true,
        };

        const towerPolygon = new Polygon3DElement(polygonOptions);

        towerPolygon.outerCoordinates = [
          { lat: 43.6427196, lng: -79.3876802, altitude: 600 },
          { lat: 43.6421742, lng: -79.3869184, altitude: 600 },
          { lat: 43.643001, lng: -79.3866475, altitude: 600 },
          { lat: 43.6427196, lng: -79.3876802, altitude: 600 }
        ];

        map3DElement.append(towerPolygon);

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.append(map3DElement);
        }
      } catch (error) {
        console.error("3D Maps init failed:", error);
      }
    };

    loadGoogleMapsScript();
    const timer = setTimeout(() => {
      if (window.google?.maps?.importLibrary) {
        initMap();
      } else {
        console.warn("Waiting for Google Maps to load...");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", backgroundColor: "black" }}
    />
  );
};

export default SpaceMap;
