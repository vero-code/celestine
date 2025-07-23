import React, { useState } from 'react';
import './App.css';
import './css/map-toggle-buttons.css';
import SpaceMap from "./components/SpaceMap.jsx";
import EarthMap from './components/EarthMap.jsx';
import SpaceChat from "./components/SpaceChat.jsx";

function App() {
  const [currentMap, setCurrentMap] = useState('space');

  const MapComponent = currentMap === 'space' ? SpaceMap : EarthMap;

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
      </div>

      {/* Central Area - "Space Map" */}
      <div className="main-content">
        <h1>Google Maps for Space</h1>
        <div id="map-container">
          <MapComponent />
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
