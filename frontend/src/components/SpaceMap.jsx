import React, { useEffect, useRef } from "react";

const SpaceMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!window.google || !window.google.maps) return;

      const { Map } = await window.google.maps.importLibrary('maps');

      const map = new Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true,
      });

      const markerData = [
        { lat: 10, lng: 20, name: 'Lunar Base Alpha' },
        { lat: -30, lng: 60, name: 'Mars Outpost' },
        { lat: 45, lng: -90, name: 'Titan Relay' },
      ];

      markerData.forEach(({ lat, lng, name }) => {
        new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title: name,
        });
      });
    };

    const loadGoogleMapsScript = () => {
      if (window.google?.maps?.importLibrary) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      const params = new URLSearchParams({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        v: 'alpha',
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

export default SpaceMap;
