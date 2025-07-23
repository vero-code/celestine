import React from 'react';
import './App.css';
import SpaceMap from "./components/SpaceMap.jsx";
import SpaceChat from "./components/SpaceChat.jsx";

function App() {
  return (
    <div className="app-container">
      {/* Left Sidebar - Controls */}
      <div className="sidebar left-sidebar">
        <h2>Navigation / Controls</h2>
        <p>This section will contain buttons for "jumping" between planets, search functionality, etc.</p>
      </div>

      {/* Central Area - "Space Map" */}
      <div className="main-content">
        <h1>Google Maps for Space</h1>
        <div id="map-container">
          <SpaceMap />
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
