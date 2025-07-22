import React from 'react';
import './App.css';
import SpaceMap from "./components/SpaceMap.jsx";

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
        <div id="map-container" className="map-placeholder">
          <SpaceMap />
        </div>
      </div>

      {/* Right Sidebar - AI Chat */}
      <div className="sidebar right-sidebar">
        <h2>Chat with Space AI Agent</h2>
        <div className="chat-placeholder">
          <p>
            Chat interface with an AI agent (based on ADK).
            Users will be able to ask questions about space,
            request to "show" specific objects, etc.
          </p>
          <div className="chat-messages">
            <p><strong>Agent:</strong> Hello! Where would you like to go today?</p>
            <p><strong>You:</strong> Tell me about Mars!</p>
            <p><strong>Agent:</strong> Of course, Mars is the fourth planet from the Sun...</p>
          </div>
          <input type="text" placeholder="Ask a question..." className="chat-input" />
          <button className="chat-send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
