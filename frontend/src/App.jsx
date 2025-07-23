import React, { useState } from 'react';
import './App.css';
import './components/css/SpaceChat.css';
import './css/map-toggle-buttons.css';
import SpaceMap from "./components/SpaceMap.jsx";
import EarthMap from './components/earth/EarthMap.jsx';
import SpaceChat from "./components/chat/SpaceChat.jsx";
import GalacticNavigator from "./components/GalacticNavigator.jsx";
import {useAppStore} from "./stores/useAppStore.js";
import PlanetMap from "./components/PlanetMap.jsx";

function App() {
  const [currentMap, setCurrentMap] = useState('space');
  const selectedPlanet = useAppStore((state) => state.target);

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
            🌍 Return to Earth
          </button>
        </div>
        <p>Use the buttons above to switch between space and Earth.</p>

        {/* Navigation panel for planets (only in space mode) */}
        {currentMap === 'space' && (
          <GalacticNavigator />
        )}
      </div>

      {/* Central Area - Map Content */}
      <div className="main-content">
        <h1>Celestine: A Google Maps for Space</h1>
        <div id="map-container">
          {currentMap === 'space' ? (
            <>
              <SpaceMap onLand={() => setCurrentMap('planet')} />
            </>
          ) : currentMap === 'planet' ? (
            <PlanetMap planet={selectedPlanet} />
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
