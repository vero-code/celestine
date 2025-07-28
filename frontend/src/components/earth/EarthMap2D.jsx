import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../stores/useAppStore";

const EarthMap2D = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const places = useAppStore((state) => state.placeResults);

  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      if (!window.google || !window.google.maps || !mapRef.current) return;
      if (mapInstanceRef.current) return;

      const { Map } = await window.google.maps.importLibrary('maps');

      const map = new Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true,
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    const loadGoogleMapsScript = () => {
      if (window.google?.maps?.importLibrary) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      const params = new URLSearchParams({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        v: 'weekly',
        libraries: 'marker',
      });

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      script.onerror = () => console.error('Google Maps JS API failed to load');
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (!isMapReady || !places) return;

    const map = mapInstanceRef.current;
    if (!map) return;
    if (!places) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (places.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      const position = { lat: place.latitude, lng: place.longitude };
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: place.name,
      });
      markersRef.current.push(marker);
      bounds.extend(position);
    });

    map.fitBounds(bounds);

    if (places.length === 1) {
        map.setZoom(10);
    }

  }, [places, isMapReady]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
      }}
    >
      {/* Map will be loaded here */}
    </div>
  );
};

export default EarthMap2D;