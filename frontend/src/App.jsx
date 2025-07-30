import React from 'react';
import './App.css';
import './components/chat/css/SpaceChat.css';
import './css/map-toggle-buttons.css';
import SpaceMap from "./components/SpaceMap.jsx";
import EarthMap from './components/earth/EarthMap.jsx';
import SpaceChat from "./components/chat/SpaceChat.jsx";
import TavusModal from "./components/chat/TavusModal.jsx";
import GalacticNavigator from "./components/GalacticNavigator.jsx";
import { PlanetSurface2D } from './components/PlanetSurface2D.jsx';
import EarthMap2D from './components/earth/EarthMap2D.jsx';

import { useAppStore } from "./stores/useAppStore.js";
import { planetPois } from './data/planetPois.js';

const SoundOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
);
const SoundOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>
);
const MessageSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

function App() {
  const currentMap = useAppStore((state) => state.currentMap);
  const setCurrentMap = useAppStore((state) => state.setCurrentMap);
  const selectedPlanet = useAppStore((state) => state.target);
  const isSpeechEnabled = useAppStore((state) => state.isSpeechEnabled);
  const toggleSpeech = useAppStore((state) => state.toggleSpeech);
  const activeChatMode = useAppStore((state) => state.activeChatMode);
  const setActiveChatMode = useAppStore((state) => state.setActiveChatMode);

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
                  <div
                    key={index}
                    className="poi-nav-item"
                  >
                    📍 {poi.name}
                  </div>
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
        <div className="chat-header">
          <h2>Space AI Agent</h2>
          <div className="chat-controls">
            <button onClick={() => setActiveChatMode('text')} className={`chat-mode-button ${activeChatMode === 'text' ? 'active' : ''}`} title="Text Chat">
              <MessageSquareIcon />
            </button>
            <button onClick={() => setActiveChatMode('video')} className={`chat-mode-button ${activeChatMode === 'video' ? 'active' : ''}`} title="Video Chat">
              <VideoIcon />
            </button>
            <button onClick={toggleSpeech} className="speech-toggle-button" title={isSpeechEnabled ? "Disable Speech" : "Enable Speech"}>
              {isSpeechEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>
          </div>
        </div>
        <SpaceChat />
      </div>
      {activeChatMode === 'video' && <TavusModal />}
    </div>
  );
}

export default App;
