import React from 'react';
import './App.css';
import './components/css/SpaceChat.css';
import './css/map-toggle-buttons.css';
import SpaceMap from "./components/SpaceMap.jsx";
import EarthMap from './components/earth/EarthMap.jsx';
import SpaceChat from "./components/chat/SpaceChat.jsx";
import GalacticNavigator from "./components/GalacticNavigator.jsx";
import { PlanetSurface2D } from './components/PlanetSurface2D.jsx';
import EarthMap2D from './components/earth/EarthMap2D.jsx';

import { useAppStore } from "./stores/useAppStore.js";
import { planetPois } from './data/planetPois.js';

function App() {
  const currentMap = useAppStore((state) => state.currentMap);
  const setCurrentMap = useAppStore((state) => state.setCurrentMap);
  const selectedPlanet = useAppStore((state) => state.target);

  const currentPlanetPois = planetPois[selectedPlanet] || [];

  return (
    <div className="app-container">
      {/* Left Sidebar - Controls */}
      <div className="sidebar left-sidebar">
        <h2>Navigation</h2>
        <div className="map-toggle-buttons">
          <button
            className={currentMap === 'space' ? 'active' : ''}
            onClick={() => setCurrentMap('space')}
          >
            🪐 Flight into Space
          </button>
          <button
            className={currentMap === 'earth' ? 'active' : ''}
            onClick={() => setCurrentMap('earth')}
          >
            🌍 Return to Earth (3D)
          </button>
          <button
            className={currentMap === 'earth2d' ? 'active' : ''}
            onClick={() => setCurrentMap('earth2d')}
          >
            🗺️ View 2D map of the Earth
          </button>
        </div>
        <p>Use the buttons above to switch between space and Earth.</p>

        {/* Navigation panel for planets (only in space mode) */}
        {currentMap === 'space' && (
          <GalacticNavigator />
        )}

        {/* Navigation panel for current planet and its POIs (only in planet mode) */}
        {currentMap === 'planet' && selectedPlanet && (
          <div className="planet-poi-navigator mt-4">
            <h3>{selectedPlanet} POIs</h3>
            {currentPlanetPois.length > 0 ? (
              <div className="poi-list">
                {currentPlanetPois.map((poi, index) => (
                  <button
                    key={index}
                    className="poi-nav-button"
                    onClick={() => {
                      console.log(`Clicked POI in sidebar: ${poi.name} on ${selectedPlanet}`);
                      // TODO: Implement centering on POI or triggering AI agent
                    }}
                  >
                    📍 {poi.name}
                  </button>
                ))}
              </div>
            ) : (
              <p>No POIs available for {selectedPlanet}.</p>
            )}
          </div>
        )}
      </div>

      {/* Central Area - Map Content */}
      <div className="main-content">
        <h1>Celestine: Google Maps for Space</h1>
        <div id="map-container">
          {currentMap === 'space' ? (
            <>
              <SpaceMap />
            </>
          ) : currentMap === 'planet' ? (
            selectedPlanet === 'Earth' ? (
              <EarthMap />
            ) : (
              <PlanetSurface2D planet={selectedPlanet} />
            )
          ) : currentMap === 'earth2d' ? (
            <EarthMap2D />
          ) : (
            <EarthMap />
          )}
        </div>
      </div>

      {/* Right Sidebar - AI Chat */}
      <div className="sidebar right-sidebar">
        <h2>Chat with Space AI Agent</h2>
        <SpaceChat />
      </div>
    </div>
  );
}

export default App;
