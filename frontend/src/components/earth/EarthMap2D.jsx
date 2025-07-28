/* global google */
import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../stores/useAppStore";

let isGoogleMapsApiLoaded = false;
const loadGoogleMapsScript = (callback) => {
  if (isGoogleMapsApiLoaded || window.google?.maps?.Map) {
    if (!isGoogleMapsApiLoaded) isGoogleMapsApiLoaded = true;
    callback();
    return;
  }

  if (document.getElementById('google-maps-script')) return;

  const script = document.createElement('script');
  script.id = 'google-maps-script';
  const params = new URLSearchParams({
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    v: 'weekly',
    libraries: 'maps,marker',
  });

  script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    isGoogleMapsApiLoaded = true;
    callback();
  };
  script.onerror = () => console.error('Google Maps JS API failed to load');
  document.head.appendChild(script);
};

const EarthMap2D = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const places = useAppStore((state) => state.placeResults);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        disableDefaultUI: true,
        mapId: 'DEMO_MAP_ID'
      });
      mapInstanceRef.current = map;
      setIsMapReady(true);
    });
  }, []);

  useEffect(() => {
    const updateMarkers = async () => {
      if (!isMapReady || !places) return;
      const map = mapInstanceRef.current;
      if (!map) return;

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      markersRef.current.forEach(marker => {
        marker.map = null;
      });
      markersRef.current = [];

      if (places.length === 0) return;

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        const position = { lat: place.latitude, lng: place.longitude };
        const marker = new AdvancedMarkerElement({
          position,
          map,
          title: place.name,
        });
        markersRef.current.push(marker);
        bounds.extend(position);
      });

      setTimeout(() => {
        if (mapRef.current) {
          google.maps.event.trigger(map, 'resize');
          map.fitBounds(bounds);
          if (places.length === 1) {
            map.setZoom(8);
          }
        }
      }, 100);
    };

    updateMarkers();

  }, [places, isMapReady]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a237e',
      }}
    >
      {/* Map will be loaded here */}
    </div>
  );
};

export default EarthMap2D;